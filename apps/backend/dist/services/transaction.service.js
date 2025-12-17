"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const transaction_repository_1 = require("../repositories/transaction.repository");
const account_service_1 = require("./account.service");
const transaction_entity_1 = require("../entities/transaction.entity");
const transaction_category_service_1 = require("./transaction-category.service");
let TransactionService = class TransactionService {
    transactionRepository;
    accountService;
    transactionCategoryService;
    constructor(transactionRepository, accountService, transactionCategoryService) {
        this.transactionRepository = transactionRepository;
        this.accountService = accountService;
        this.transactionCategoryService = transactionCategoryService;
    }
    generateHash(description, amount, date, accountId) {
        const data = `${description}:${amount}:${date}:${accountId}`;
        return (0, crypto_1.createHash)('sha256').update(data).digest('hex');
    }
    async ingest(bankStatement) {
        const account = await this.accountService.saveOrCreate(bankStatement.account.bsb, bankStatement.account.accountNumber, bankStatement.account.bankName);
        for (const statementTransaction of bankStatement.transactions) {
            const amount = statementTransaction.debit ?? statementTransaction.credit ?? 0;
            const type = statementTransaction.debit ? 'expense' : 'income';
            const hash = this.generateHash(statementTransaction.description, amount, statementTransaction.date, account.id);
            const existingTransaction = await this.transactionRepository.findByHash(hash);
            if (existingTransaction) {
                continue;
            }
            const category = await this.transactionCategoryService.findOut(statementTransaction.description);
            const transaction = new transaction_entity_1.Transaction();
            transaction.account = account;
            transaction.amount = amount;
            transaction.balance = statementTransaction.balance;
            transaction.description = statementTransaction.description;
            transaction.transactionDate = new Date(statementTransaction.date);
            transaction.hash = hash;
            transaction.type = type;
            transaction.category = category ?? undefined;
            await this.transactionRepository.save(transaction);
        }
    }
    async updateCategory(transactionUid, categoryUid) {
        const transaction = await this.transactionRepository.findByUid(transactionUid);
        if (!transaction) {
            throw new Error('Transaction not found');
        }
        if (categoryUid) {
            const category = await this.transactionCategoryService.findByUid(categoryUid);
            if (!category) {
                throw new Error('Category not found');
            }
            transaction.category = category;
        }
        else {
            transaction.category = undefined;
        }
        return this.transactionRepository.save(transaction);
    }
    async updateType(transactionUid, type) {
        const transaction = await this.transactionRepository.findByUid(transactionUid);
        if (!transaction) {
            throw new Error('Transaction not found');
        }
        if (!['income', 'expense', 'transfer'].includes(type)) {
            throw new Error('Invalid transaction type');
        }
        transaction.type = type;
        return this.transactionRepository.save(transaction);
    }
};
exports.TransactionService = TransactionService;
exports.TransactionService = TransactionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [transaction_repository_1.TransactionRepository,
        account_service_1.AccountService,
        transaction_category_service_1.TransactionCategoryService])
], TransactionService);
//# sourceMappingURL=transaction.service.js.map