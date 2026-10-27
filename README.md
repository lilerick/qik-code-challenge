# QIK Banking API — Technical Challenge

Backend de operaciones bancarias construido con **NestJS, TypeScript, GraphQL y PostgreSQL**, con caché Redis, búsqueda Elasticsearch y pruebas de integración.

## Funcionalidades

- Gestión de clientes y cuentas bancarias mediante GraphQL.
- Depósitos, retiros y transferencias, incluidas transferencias con conversión de moneda.
- Validación de entrada con DTOs y `ValidationPipe`.
- Operaciones monetarias con `decimal.js`, transacciones PostgreSQL y bloqueo de filas para proteger saldos ante concurrencia.
- Claves de idempotencia para evitar que una solicitud repetida duplique una operación.
- Caché Redis de monedas con fallback a PostgreSQL cuando Redis no está disponible.
- Búsqueda de transacciones mediante Elasticsearch, con filtros y paginación.
- Reindexación bajo demanda y sincronización periódica del índice.
- Endpoint REST `GET /health` para PostgreSQL y Elasticsearch.
- Pruebas de integración sobre PostgreSQL aislado con Vitest.

## Tecnologías

- Node.js, NestJS 12, TypeScript (ESM)
- GraphQL / Apollo Server
- PostgreSQL 17 / TypeORM (migraciones)
- Redis 7 / Keyv
- Elasticsearch 9
- Docker Compose
- Vitest, ESLint, Prettier

## Requisitos

- Node.js y npm compatibles con las dependencias del proyecto (se recomienda una versión LTS reciente).
- Docker Engine / Docker Desktop con Docker Compose.
- Puertos disponibles: `3000` (API), `3001` (API de pruebas), `5433` (PostgreSQL), `6379` (Redis), `9200` (Elasticsearch).

## Inicio rápido

### 1. Instalar dependencias

```bash
npm ci
```

### 2. Levantar infraestructura

```bash
docker compose up -d

docker compose ps
```

El archivo `docker-compose.yml` inicia PostgreSQL, Redis y Elasticsearch. PostgreSQL se expone en `localhost:5433`; Redis y Elasticsearch se publican únicamente en `127.0.0.1`.

### 3. Configurar variables de entorno

Copiar `.env.example` a `.env`:

```powershell
Copy-Item .env.example .env
```

Ejemplo para el Docker Compose incluido:

```dotenv
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=qik
DB_PASSWORD=qik_dev_password
DB_DATABASE=qik_banking
REDIS_URL=redis://127.0.0.1:6379
ELASTICSEARCH_NODE=http://127.0.0.1:9200
```

**Importante:** `.env.example` trae `DB_PASSWORD=your_password` como marcador de posición. Sustituirlo por `qik_dev_password` para coincidir con el Compose proporcionado, o cambiar ambos valores de manera consistente. **Nunca subir `.env` a Git.** Las credenciales de Compose son exclusivamente de desarrollo local.

### 4. Crear esquema mediante migraciones

La configuración TypeORM desactiva la sincronización automática (`synchronize: false`) y la ejecución automática de migraciones (`migrationsRun: false`). Por lo tanto, las migraciones deben ejecutarse explícitamente.

```bash
npm run build
node ./node_modules/typeorm/cli.js migration:run -d dist/database/data-source.js
```

> El comando anterior presupone que `src/database/data-source.ts` exporta una instancia de `DataSource` y que su detección `isCompiled` selecciona las migraciones de `dist/database/migrations/*.js` al ejecutar el archivo compilado. Comprueba esos dos detalles antes de la primera instalación limpia.

### 5. Insertar datos iniciales

```bash
npm run seed
```

La semilla prepara datos de demostración, incluidas monedas, clientes y cuentas, conforme a la implementación del proyecto.

### 6. Iniciar la API

```bash
npm run start:dev
```

- GraphQL / interfaz interactiva: <http://localhost:3000/graphql>
- Health check: <http://localhost:3000/health>

## GraphQL

La API utiliza GraphQL para consultas y mutaciones bancarias. La documentación interactiva del esquema está disponible en `/graphql`.

### Consultar clientes

```graphql
query {
  customers {
    id
    firstName
    lastName
  }
}
```

### Consultar cuentas

Sustituye el UUID del cliente:

```graphql
query {
  accountsByCustomer(customerId: "UUID-DEL-CLIENTE") {
    id
    accountNumber
    balance
    currencyCode
  }
}
```

### Realizar un depósito

Utiliza un UUID de idempotencia nuevo para cada operación distinta:

```graphql
mutation {
  deposit(input: {
    accountId: "UUID-DE-LA-CUENTA"
    amount: "50.00"
    idempotencyKey: "d8a7f912-6d3c-4b85-93b1-e22c7a490615"
  }) {
    id
    type
    status
    amount
    currencyCode
  }
}
```

### Buscar transacciones

```graphql
query {
  searchTransactions(input: { limit: 20, offset: 0 }) {
    id
    type
    status
    amount
    currencyCode
    createdAt
  }
}
```

También se admiten filtros por cuenta, tipo de transacción, moneda y rango de fechas según `SearchTransactionsInput`.

## Persistencia y consistencia

Las operaciones financieras emplean PostgreSQL como fuente de verdad. La lógica de depósitos, retiros y transferencias se implementa en servicios especializados y utiliza transacciones SQL. Los importes se calculan mediante `decimal.js` para evitar errores típicos de coma flotante.

La clave de idempotencia permite identificar solicitudes repetidas y evitar la aplicación duplicada de un movimiento. Las pruebas verifican que dos retiros concurrentes no produzcan sobregiros.

## Redis

Redis se utiliza como caché para consultas de monedas. Ante indisponibilidad de Redis, la aplicación puede recuperar los datos de PostgreSQL. La indisponibilidad de la caché no debe impedir las operaciones bancarias.

## Elasticsearch

Elasticsearch proporciona búsqueda de transacciones sobre el índice `banking-transactions-v1`.

Para reconstruir el índice desde PostgreSQL:

```bash
npm run reindex:transactions
```

La aplicación utiliza un sincronizador periódico, con intervalo de **60 segundos**, que vuelve a indexar transacciones guardadas en PostgreSQL. Los documentos tienen como identificador el UUID de la transacción, lo que evita duplicados en reindexaciones repetidas.

**Consistencia eventual:** un movimiento confirmado en PostgreSQL puede tardar hasta el siguiente ciclo de sincronización, más el refresco de Elasticsearch, en aparecer en la búsqueda. Si Elasticsearch falla, las operaciones bancarias continúan y la sincronización se reintentará en un ciclo posterior.

**Limitación conocida:** el sincronizador reindexa el conjunto de movimientos en vez de procesar únicamente los nuevos. Es suficiente para el volumen del challenge, pero no es una estrategia adecuada para volúmenes elevados ni sustituye un *transactional outbox* con workers y reintentos durables. La protección contra ejecuciones solapadas es local a cada instancia de aplicación.

## Health check

```http
GET http://localhost:3000/health
```

Respuesta representativa:

```json
{
  "status": "ok",
  "timestamp": "2026-10-27T06:02:28.852Z",
  "services": {
    "postgres": "up",
    "elasticsearch": "up"
  }
}
```

El endpoint comprueba PostgreSQL y Elasticsearch; **no hace todavía un ping independiente a Redis**. El estado general `ok` indica que PostgreSQL está disponible, aunque una dependencia de búsqueda pueda estar degradada.

## Pruebas automatizadas

Las pruebas de integración se encuentran en `src/test/banking.integration.spec.ts`. Verifican:

1. Depósito exitoso.
2. Idempotencia de depósito.
3. Rechazo de retiro por fondos insuficientes sin alterar el saldo.
4. Transferencia entre cuentas de la misma moneda.
5. Conversión USD → DOP con la tasa configurada en la base de pruebas.
6. Concurrencia: dos retiros simultáneos no pueden sobregirar una cuenta.

### Base de pruebas aislada

Crear una base de datos separada en el PostgreSQL de Docker:

```powershell
docker exec qik-postgres createdb -U qik qik_banking_test
```

En una **terminal PowerShell exclusiva para pruebas**, configurar las variables antes de migraciones y seed:

```powershell
$env:NODE_ENV = "test"
$env:DB_DATABASE = "qik_banking_test"
$env:PORT = "3001"

npm run build
node ./node_modules/typeorm/cli.js migration:run -d dist/database/data-source.js
npm run seed
npm run start:dev
```

En otra terminal ejecutar:

```powershell
npx vitest run src/test/banking.integration.spec.ts
```

**Advertencia de seguridad:** no ejecutar esta suite contra `qik_banking` ni contra una base compartida. El arranque con `NODE_ENV=test` comprueba que PostgreSQL responde con el nombre `qik_banking_test` y exige puerto `3001`; el archivo de pruebas también valida que la URL apunte a localhost:3001. Esa protección de arranque no sustituye la precaución al ejecutar scripts CLI de migración o seed.

La suite requiere una API de pruebas activa y no se ejecuta de manera autónoma. Las seis pruebas de integración han pasado en el entorno local de desarrollo; no se afirma cobertura total del proyecto ni una prueba inyectada de rollback tras escritura parcial.

## Calidad y comandos útiles

```bash
npm run build
npm run lint:check
npm run format:check
npm run format
npm run test
npm run reindex:transactions
```

El script `npm run test` ejecuta Vitest; las pruebas de integración HTTP exigen que la API de pruebas esté iniciada previamente. Los logs de NestJS se limitan a los niveles configurados en `src/main.ts`.

## Estructura principal

```text
src/
├── database/
│   ├── data-source.ts
│   ├── migrations/
│   └── seeds/
├── infrastructure/
│   ├── cache/
│   └── search/
├── modules/
│   ├── accounts/
│   ├── currencies/
│   ├── customers/
│   ├── exchange-rates/
│   ├── health/
│   └── transactions/
│       ├── dto/
│       ├── entities/
│       ├── models/
│       └── services/
├── scripts/
├── test/
│   └── banking.integration.spec.ts
└── main.ts
```

## Alcance y posibles mejoras

Este repositorio es una prueba técnica, no una plataforma bancaria lista para producción. Algunas mejoras fuera del alcance actual son autenticación/autorización, observabilidad centralizada, un sistema de *outbox* para Elasticsearch, sincronización incremental, pruebas adicionales de rollback y automatización completa del ambiente de pruebas en CI.
