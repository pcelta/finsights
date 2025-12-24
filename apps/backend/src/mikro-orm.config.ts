import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Account } from './entities/account.entity';
import { Transaction } from './entities/transaction.entity';
import { TransactionCategory } from './entities/transaction-category.entity';
import { FinancialInstitution } from './entities/financial-institution.entity';
import { StatementImport } from './entities/statement-import.entity';
import { UserAccount } from './entities/user-account.entity';
import { UserAccountToken } from './entities/user-account-token.entity';
import { UserAccountActivation } from './entities/user-account-activation.entity';

const config: Options = {
  driver: PostgreSqlDriver,
  entities: [
    Account,
    Transaction,
    TransactionCategory,
    FinancialInstitution,
    StatementImport,
    UserAccount,
    UserAccountToken,
    UserAccountActivation,
  ],
  dbName: process.env.DB_NAME || 'finsinghts',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5439'),
  user: process.env.DB_USER || 'finsinghts',
  password: process.env.DB_PASSWORD || 'finsinghts',
  migrations: {
    path: './src/migrations',
    pathTs: './src/migrations',
  },
  debug: process.env.NODE_ENV === 'development',
};

export default config;
