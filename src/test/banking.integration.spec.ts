import { beforeAll, describe, expect, it } from 'vitest';
import { randomUUID } from 'node:crypto';

const API_URL = 'http://localhost:3001/graphql';

type GraphQLError = { message: string };

type GraphQLResponse<T> = {
  data?: T;
  errors?: GraphQLError[];
};

type AccountResult = {
  id: string;
  balance: string;
  currencyCode: string;
};

type TransactionResult = {
  id: string;
  status: string;
  type: string;
  amount: string;
  destinationAmount?: string | null;
};

async function graphql<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<GraphQLResponse<T>> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  const result = (await response.json()) as GraphQLResponse<T>;

  if (!response.ok) {
    throw new Error(
      `GraphQL HTTP ${response.status}: ${JSON.stringify(result.errors)}`,
    );
  }

  return result;
}

async function getAccount(id: string): Promise<AccountResult> {
  const result = await graphql<{ account: AccountResult }>(
    `
      query ($id: ID!) {
        account(id: $id) {
          id
          balance
          currencyCode
        }
      }
    `,
    { id },
  );

  expect(result.errors).toBeUndefined();
  expect(result.data?.account).toBeDefined();

  return result.data!.account;
}

async function createAccount(
  customerId: string,
  currencyCode: string,
): Promise<string> {
  const result = await graphql<{ createAccount: { id: string } }>(
    `
      mutation ($input: CreateAccountInput!) {
        createAccount(input: $input) {
          id
        }
      }
    `,
    {
      input: {
        customerId,
        currencyCode,
      },
    },
  );

  expect(result.errors).toBeUndefined();
  expect(result.data?.createAccount.id).toBeDefined();

  return result.data!.createAccount.id;
}

async function deposit(
  accountId: string,
  amount: string,
  idempotencyKey = randomUUID(),
) {
  return graphql<{ deposit: TransactionResult }>(
    `
      mutation ($input: DepositInput!) {
        deposit(input: $input) {
          id
          status
          type
          amount
        }
      }
    `,
    {
      input: {
        accountId,
        amount,
        idempotencyKey,
      },
    },
  );
}

async function withdraw(
  accountId: string,
  amount: string,
  idempotencyKey = randomUUID(),
) {
  return graphql<{ withdraw: TransactionResult }>(
    `
      mutation ($input: WithdrawInput!) {
        withdraw(input: $input) {
          id
          status
          type
          amount
        }
      }
    `,
    {
      input: {
        accountId,
        amount,
        idempotencyKey,
      },
    },
  );
}

async function transfer(
  sourceAccountId: string,
  destinationAccountId: string,
  amount: string,
  idempotencyKey = randomUUID(),
) {
  return graphql<{ transfer: TransactionResult }>(
    `
      mutation ($input: TransferInput!) {
        transfer(input: $input) {
          id
          status
          type
          amount
          destinationAmount
        }
      }
    `,
    {
      input: {
        sourceAccountId,
        destinationAccountId,
        amount,
        idempotencyKey,
      },
    },
  );
}

describe('Banking operations — PostgreSQL integration', () => {
  let dopAccount: string;
  let usdAccount: string;
  let secondUsdAccount: string;
  let concurrencyAccount: string;

  beforeAll(async () => {
    // Guardrail: never run against the normal banking API.
    expect(API_URL).toContain(':3001/');

    const result = await graphql<{
      customers: { id: string }[];
    }>(`
      query {
        customers {
          id
        }
      }
    `);

    expect(result.errors).toBeUndefined();

    const customerId = result.data?.customers[0]?.id;

    if (!customerId) {
      throw new Error('No test customers found. Run the test database seed.');
    }

    dopAccount = await createAccount(customerId, 'DOP');
    usdAccount = await createAccount(customerId, 'USD');
    secondUsdAccount = await createAccount(customerId, 'USD');
    concurrencyAccount = await createAccount(customerId, 'DOP');
  }, 30_000);

  it('deposits money correctly', async () => {
    const result = await deposit(dopAccount, '100.00');

    expect(result.errors).toBeUndefined();
    expect(result.data?.deposit.status).toBe('COMPLETED');
    expect(result.data?.deposit.type).toBe('DEPOSIT');

    const account = await getAccount(dopAccount);

    expect(Number(account.balance)).toBe(100);
  });

  it('does not duplicate deposits with the same idempotency key', async () => {
    const key = randomUUID();
    const first = await deposit(dopAccount, '25.00', key);
    const second = await deposit(dopAccount, '25.00', key);

    expect(first.errors).toBeUndefined();
    expect(second.errors).toBeUndefined();

    expect(second.data?.deposit.id).toBe(first.data?.deposit.id);

    const account = await getAccount(dopAccount);

    expect(Number(account.balance)).toBe(125);
  });

  it('rejects withdrawals with insufficient funds without changing balance', async () => {
    const before = await getAccount(dopAccount);

    const result = await withdraw(dopAccount, '999999.00');

    expect(result.errors?.length).toBeGreaterThan(0);
    expect(result.errors?.[0].message).toContain('Insufficient funds');

    const after = await getAccount(dopAccount);

    expect(after.balance).toBe(before.balance);
  });

  it('transfers money atomically between USD accounts', async () => {
    await deposit(usdAccount, '100.00');

    const result = await transfer(usdAccount, secondUsdAccount, '40.00');

    expect(result.errors).toBeUndefined();
    expect(result.data?.transfer.status).toBe('COMPLETED');

    const source = await getAccount(usdAccount);
    const destination = await getAccount(secondUsdAccount);

    expect(Number(source.balance)).toBe(60);
    expect(Number(destination.balance)).toBe(40);
  });

  it('converts USD to DOP using the configured exchange rate', async () => {
    const beforeSource = await getAccount(usdAccount);
    const beforeDestination = await getAccount(dopAccount);

    const result = await transfer(usdAccount, dopAccount, '10.00');

    expect(result.errors).toBeUndefined();

    const received = Number(result.data?.transfer.destinationAmount);

    // The seed currently configures USD -> DOP at 60.
    expect(received).toBe(600);

    const afterSource = await getAccount(usdAccount);
    const afterDestination = await getAccount(dopAccount);

    expect(Number(afterSource.balance)).toBe(Number(beforeSource.balance) - 10);

    expect(Number(afterDestination.balance)).toBe(
      Number(beforeDestination.balance) + received,
    );
  });

  it('prevents concurrent withdrawals from overdrawing an account', async () => {
    await deposit(concurrencyAccount, '100.00');

    const results = await Promise.all([
      withdraw(concurrencyAccount, '80.00'),
      withdraw(concurrencyAccount, '80.00'),
    ]);

    const successful = results.filter(
      (result) => result.data?.withdraw.status === 'COMPLETED',
    );

    const rejected = results.filter(
      (result) => (result.errors?.length ?? 0) > 0,
    );

    expect(successful).toHaveLength(1);
    expect(rejected).toHaveLength(1);

    const account = await getAccount(concurrencyAccount);

    expect(Number(account.balance)).toBe(20);
  });
});
