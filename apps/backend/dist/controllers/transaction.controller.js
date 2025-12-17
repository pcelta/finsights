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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionController = void 0;
const common_1 = require("@nestjs/common");
const transaction_service_1 = require("../services/transaction.service");
const transaction_category_service_1 = require("../services/transaction-category.service");
let TransactionController = class TransactionController {
    transactionService;
    transactionCategoryService;
    constructor(transactionService, transactionCategoryService) {
        this.transactionService = transactionService;
        this.transactionCategoryService = transactionCategoryService;
    }
    async updateCategory(uid, categoryUid) {
        const transaction = await this.transactionService.updateCategory(uid, categoryUid);
        return {
            uid: transaction.uid,
            date: transaction.transactionDate,
            description: transaction.description,
            amount: Number(transaction.amount),
            balance: Number(transaction.balance),
            type: transaction.type,
            category: transaction.category
                ? {
                    uid: transaction.category.uid,
                    name: transaction.category.name,
                    slug: transaction.category.slug,
                }
                : null,
            account: {
                uid: transaction.account.uid,
                bsb: transaction.account.bsb,
                number: transaction.account.number,
                bankName: transaction.account.bankName,
                name: transaction.account.name,
            },
        };
    }
    async updateType(uid, type) {
        const transaction = await this.transactionService.updateType(uid, type);
        return {
            uid: transaction.uid,
            date: transaction.transactionDate,
            description: transaction.description,
            amount: Number(transaction.amount),
            balance: Number(transaction.balance),
            type: transaction.type,
            category: transaction.category
                ? {
                    uid: transaction.category.uid,
                    name: transaction.category.name,
                    slug: transaction.category.slug,
                }
                : null,
            account: {
                uid: transaction.account.uid,
                bsb: transaction.account.bsb,
                number: transaction.account.number,
                bankName: transaction.account.bankName,
                name: transaction.account.name,
            },
        };
    }
};
exports.TransactionController = TransactionController;
__decorate([
    (0, common_1.Patch)(':uid/category'),
    __param(0, (0, common_1.Param)('uid')),
    __param(1, (0, common_1.Body)('categoryUid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Patch)(':uid/type'),
    __param(0, (0, common_1.Param)('uid')),
    __param(1, (0, common_1.Body)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "updateType", null);
exports.TransactionController = TransactionController = __decorate([
    (0, common_1.Controller)('api/transactions'),
    __metadata("design:paramtypes", [transaction_service_1.TransactionService,
        transaction_category_service_1.TransactionCategoryService])
], TransactionController);
//# sourceMappingURL=transaction.controller.js.map