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
exports.Transaction = void 0;
const core_1 = require("@mikro-orm/core");
const account_entity_1 = require("./account.entity");
const transaction_category_entity_1 = require("./transaction-category.entity");
const crypto_1 = require("crypto");
let Transaction = class Transaction {
    id;
    uid;
    description;
    hash;
    amount;
    balance;
    transactionDate;
    type;
    createdAt = new Date();
    updatedAt = new Date();
    account;
    category;
    generateUid() {
        if (!this.uid) {
            this.uid = (0, crypto_1.randomUUID)();
        }
    }
};
exports.Transaction = Transaction;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Transaction.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ length: 36, unique: true }),
    __metadata("design:type", String)
], Transaction.prototype, "uid", void 0);
__decorate([
    (0, core_1.Property)({ type: 'text' }),
    __metadata("design:type", String)
], Transaction.prototype, "description", void 0);
__decorate([
    (0, core_1.Property)({ length: 64, unique: true }),
    (0, core_1.Index)(),
    __metadata("design:type", String)
], Transaction.prototype, "hash", void 0);
__decorate([
    (0, core_1.Property)({ type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], Transaction.prototype, "amount", void 0);
__decorate([
    (0, core_1.Property)({ type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], Transaction.prototype, "balance", void 0);
__decorate([
    (0, core_1.Property)({ type: 'date' }),
    __metadata("design:type", Date)
], Transaction.prototype, "transactionDate", void 0);
__decorate([
    (0, core_1.Property)({ length: 10 }),
    __metadata("design:type", String)
], Transaction.prototype, "type", void 0);
__decorate([
    (0, core_1.Property)({ onCreate: () => new Date() }),
    __metadata("design:type", Date)
], Transaction.prototype, "createdAt", void 0);
__decorate([
    (0, core_1.Property)({ onCreate: () => new Date(), onUpdate: () => new Date() }),
    __metadata("design:type", Date)
], Transaction.prototype, "updatedAt", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => account_entity_1.Account, { nullable: false }),
    __metadata("design:type", account_entity_1.Account)
], Transaction.prototype, "account", void 0);
__decorate([
    (0, core_1.ManyToOne)(() => transaction_category_entity_1.TransactionCategory, { nullable: true }),
    __metadata("design:type", transaction_category_entity_1.TransactionCategory)
], Transaction.prototype, "category", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Transaction.prototype, "generateUid", null);
exports.Transaction = Transaction = __decorate([
    (0, core_1.Entity)({ tableName: 'transactions' })
], Transaction);
//# sourceMappingURL=transaction.entity.js.map