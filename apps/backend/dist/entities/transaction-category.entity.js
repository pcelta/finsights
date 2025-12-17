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
exports.TransactionCategory = void 0;
const core_1 = require("@mikro-orm/core");
const transaction_entity_1 = require("./transaction.entity");
const crypto_1 = require("crypto");
let TransactionCategory = class TransactionCategory {
    id;
    uid;
    name;
    slug;
    description;
    rules;
    createdAt = new Date();
    updatedAt = new Date();
    transactions = new core_1.Collection(this);
    generateUid() {
        if (!this.uid) {
            this.uid = (0, crypto_1.randomUUID)();
        }
    }
};
exports.TransactionCategory = TransactionCategory;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], TransactionCategory.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ length: 36, unique: true }),
    __metadata("design:type", String)
], TransactionCategory.prototype, "uid", void 0);
__decorate([
    (0, core_1.Property)({ length: 100 }),
    __metadata("design:type", String)
], TransactionCategory.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)({ length: 100, unique: true }),
    __metadata("design:type", String)
], TransactionCategory.prototype, "slug", void 0);
__decorate([
    (0, core_1.Property)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], TransactionCategory.prototype, "description", void 0);
__decorate([
    (0, core_1.Property)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], TransactionCategory.prototype, "rules", void 0);
__decorate([
    (0, core_1.Property)({ onCreate: () => new Date() }),
    __metadata("design:type", Date)
], TransactionCategory.prototype, "createdAt", void 0);
__decorate([
    (0, core_1.Property)({ onCreate: () => new Date(), onUpdate: () => new Date() }),
    __metadata("design:type", Date)
], TransactionCategory.prototype, "updatedAt", void 0);
__decorate([
    (0, core_1.OneToMany)(() => transaction_entity_1.Transaction, (transaction) => transaction.category),
    __metadata("design:type", Object)
], TransactionCategory.prototype, "transactions", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TransactionCategory.prototype, "generateUid", null);
exports.TransactionCategory = TransactionCategory = __decorate([
    (0, core_1.Entity)({ tableName: 'transaction_categories' })
], TransactionCategory);
//# sourceMappingURL=transaction-category.entity.js.map