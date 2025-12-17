"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postgresql_1 = require("@mikro-orm/postgresql");
const account_entity_1 = require("./entities/account.entity");
const transaction_entity_1 = require("./entities/transaction.entity");
const transaction_category_entity_1 = require("./entities/transaction-category.entity");
const config = {
    driver: postgresql_1.PostgreSqlDriver,
    entities: [account_entity_1.Account, transaction_entity_1.Transaction, transaction_category_entity_1.TransactionCategory],
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
exports.default = config;
//# sourceMappingURL=mikro-orm.config.js.map