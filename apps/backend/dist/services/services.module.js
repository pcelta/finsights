"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_1 = require("@mikro-orm/nestjs");
const transaction_service_1 = require("./transaction.service");
const account_service_1 = require("./account.service");
const transaction_category_service_1 = require("./transaction-category.service");
const transaction_repository_1 = require("../repositories/transaction.repository");
const account_repository_1 = require("../repositories/account.repository");
const transaction_category_repository_1 = require("../repositories/transaction-category.repository");
const transaction_entity_1 = require("../entities/transaction.entity");
const account_entity_1 = require("../entities/account.entity");
const transaction_category_entity_1 = require("../entities/transaction-category.entity");
let ServicesModule = class ServicesModule {
};
exports.ServicesModule = ServicesModule;
exports.ServicesModule = ServicesModule = __decorate([
    (0, common_1.Module)({
        imports: [nestjs_1.MikroOrmModule.forFeature([transaction_entity_1.Transaction, account_entity_1.Account, transaction_category_entity_1.TransactionCategory])],
        providers: [
            transaction_service_1.TransactionService,
            account_service_1.AccountService,
            transaction_category_service_1.TransactionCategoryService,
            transaction_repository_1.TransactionRepository,
            account_repository_1.AccountRepository,
            transaction_category_repository_1.TransactionCategoryRepository,
        ],
        exports: [transaction_service_1.TransactionService, account_service_1.AccountService, transaction_category_service_1.TransactionCategoryService],
    })
], ServicesModule);
//# sourceMappingURL=services.module.js.map