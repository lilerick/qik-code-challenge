export class InitialBankingSchema1793044145063 {
    name = 'InitialBankingSchema1793044145063';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "public"."customer_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`);
        await queryRunner.query(`CREATE TABLE "customers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying(100) NOT NULL, "last_name" character varying(100) NOT NULL, "email" character varying(255) NOT NULL, "document_number" character varying(30) NOT NULL, "status" "public"."customer_status_enum" NOT NULL DEFAULT 'ACTIVE', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_customers_email" ON "customers"  ("email") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_customers_document_number" ON "customers"  ("document_number") `);
        await queryRunner.query(`CREATE TABLE "currencies" ("code" character varying(3) NOT NULL, "name" character varying(50) NOT NULL, "decimal_places" smallint NOT NULL DEFAULT '2', "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "CHK_currencies_decimal_places" CHECK ("decimal_places" BETWEEN 0 AND 4), CONSTRAINT "PK_9f8d0972aeeb5a2277e40332d29" PRIMARY KEY ("code"))`);
        await queryRunner.query(`CREATE TYPE "public"."account_status_enum" AS ENUM('ACTIVE', 'FROZEN', 'CLOSED')`);
        await queryRunner.query(`CREATE TABLE "accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_number" character varying(20) NOT NULL, "customer_id" uuid NOT NULL, "currency_code" character varying(3) NOT NULL, "balance" numeric(19,4) NOT NULL DEFAULT '0', "status" "public"."account_status_enum" NOT NULL DEFAULT 'ACTIVE', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_ffd1ae96513bfb2c6eada0f7d31" UNIQUE ("account_number"), CONSTRAINT "CHK_accounts_balance_nonnegative" CHECK ("balance" >= 0), CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "exchange_rates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "from_currency_code" character varying(3) NOT NULL, "to_currency_code" character varying(3) NOT NULL, "rate" numeric(24,12) NOT NULL, "effective_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "CHK_exchange_rates_different_currencies" CHECK ("from_currency_code" <> "to_currency_code"), CONSTRAINT "CHK_exchange_rates_positive" CHECK ("rate" > 0), CONSTRAINT "PK_33a614bad9e61956079d817ebe2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_exchange_rates_pair_effective" ON "exchange_rates"  ("from_currency_code", "to_currency_code", "effective_at") `);
        await queryRunner.query(`CREATE TYPE "public"."transaction_type_enum" AS ENUM('DEPOSIT', 'WITHDRAWAL', 'TRANSFER')`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_status_enum" AS ENUM('COMPLETED', 'REVERSED')`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."transaction_type_enum" NOT NULL, "status" "public"."transaction_status_enum" NOT NULL DEFAULT 'COMPLETED', "source_account_id" uuid, "destination_account_id" uuid, "amount" numeric(19,4) NOT NULL, "currency_code" character varying(3) NOT NULL, "destination_amount" numeric(19,4), "destination_currency_code" character varying(3), "exchange_rate_applied" numeric(24,12), "idempotency_key" uuid NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "CHK_transactions_accounts" CHECK ((
    ("type" = 'DEPOSIT'
      AND "source_account_id" IS NULL
      AND "destination_account_id" IS NOT NULL)
    OR
    ("type" = 'WITHDRAWAL'
      AND "source_account_id" IS NOT NULL
      AND "destination_account_id" IS NULL)
    OR
    ("type" = 'TRANSFER'
      AND "source_account_id" IS NOT NULL
      AND "destination_account_id" IS NOT NULL
      AND "source_account_id" <> "destination_account_id")
  )), CONSTRAINT "CHK_transactions_exchange_rate" CHECK ("exchange_rate_applied" IS NULL OR "exchange_rate_applied" > 0), CONSTRAINT "CHK_transactions_destination_amount" CHECK ("destination_amount" IS NULL OR "destination_amount" > 0), CONSTRAINT "CHK_transactions_positive_amount" CHECK ("amount" > 0), CONSTRAINT "CHK_transactions_currency_fields" CHECK ((
    (
      "type" IN ('DEPOSIT', 'WITHDRAWAL')
      AND "destination_amount" IS NULL
      AND "destination_currency_code" IS NULL
      AND "exchange_rate_applied" IS NULL
    )
    OR
    (
      "type" = 'TRANSFER'
      AND "destination_amount" IS NOT NULL
      AND "destination_currency_code" IS NOT NULL
      AND (
        (
          "currency_code" = "destination_currency_code"
          AND "exchange_rate_applied" IS NULL
        )
        OR
        (
          "currency_code" <> "destination_currency_code"
          AND "exchange_rate_applied" IS NOT NULL
        )
      )
    )
  )), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_transactions_idempotency_key" ON "transactions"  ("idempotency_key") `);
        await queryRunner.query(`CREATE INDEX "IDX_transactions_destination_created" ON "transactions"  ("destination_account_id", "created_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_transactions_source_created" ON "transactions"  ("source_account_id", "created_at") `);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "FK_8b74e55f12afe9234f76a42dc30" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "accounts" ADD CONSTRAINT "FK_a4cafed13e3ede137659efc9f76" FOREIGN KEY ("currency_code") REFERENCES "currencies"("code") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exchange_rates" ADD CONSTRAINT "FK_8f3eae629b8e2497ffcd4aa10a8" FOREIGN KEY ("from_currency_code") REFERENCES "currencies"("code") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "exchange_rates" ADD CONSTRAINT "FK_2ec8797352a5b0996342d245563" FOREIGN KEY ("to_currency_code") REFERENCES "currencies"("code") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_a008a672b1acca7f679de9f2a2a" FOREIGN KEY ("source_account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_98c19d7f096b4ab011d3547eb0d" FOREIGN KEY ("destination_account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_2f924e47919a97dc6168abda024" FOREIGN KEY ("currency_code") REFERENCES "currencies"("code") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD CONSTRAINT "FK_772e6a4f0a190bc0311e45cb2c5" FOREIGN KEY ("destination_currency_code") REFERENCES "currencies"("code") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_772e6a4f0a190bc0311e45cb2c5"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_2f924e47919a97dc6168abda024"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_98c19d7f096b4ab011d3547eb0d"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_a008a672b1acca7f679de9f2a2a"`);
        await queryRunner.query(`ALTER TABLE "exchange_rates" DROP CONSTRAINT "FK_2ec8797352a5b0996342d245563"`);
        await queryRunner.query(`ALTER TABLE "exchange_rates" DROP CONSTRAINT "FK_8f3eae629b8e2497ffcd4aa10a8"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_a4cafed13e3ede137659efc9f76"`);
        await queryRunner.query(`ALTER TABLE "accounts" DROP CONSTRAINT "FK_8b74e55f12afe9234f76a42dc30"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_transactions_source_created"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_transactions_destination_created"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_transactions_idempotency_key"`);
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_exchange_rates_pair_effective"`);
        await queryRunner.query(`DROP TABLE "exchange_rates"`);
        await queryRunner.query(`DROP TABLE "accounts"`);
        await queryRunner.query(`DROP TYPE "public"."account_status_enum"`);
        await queryRunner.query(`DROP TABLE "currencies"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_customers_document_number"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_customers_email"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP TYPE "public"."customer_status_enum"`);
    }
}
//# sourceMappingURL=1793044145063-InitialBankingSchema.js.map