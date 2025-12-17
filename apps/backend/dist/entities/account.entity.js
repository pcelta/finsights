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
exports.Account = void 0;
const core_1 = require("@mikro-orm/core");
const transaction_entity_1 = require("./transaction.entity");
const crypto_1 = require("crypto");
let Account = class Account {
    id;
    uid;
    bsb;
    number;
    bankName;
    name;
    description;
    createdAt = new Date();
    updatedAt = new Date();
    transactions = new core_1.Collection(this);
    generateUid() {
        if (!this.uid) {
            this.uid = (0, crypto_1.randomUUID)();
        }
    }
};
exports.Account = Account;
__decorate([
    (0, core_1.PrimaryKey)(),
    __metadata("design:type", Number)
], Account.prototype, "id", void 0);
__decorate([
    (0, core_1.Property)({ length: 36, unique: true }),
    __metadata("design:type", String)
], Account.prototype, "uid", void 0);
__decorate([
    (0, core_1.Property)({ length: 6 }),
    __metadata("design:type", String)
], Account.prototype, "bsb", void 0);
__decorate([
    (0, core_1.Property)({ length: 20 }),
    __metadata("design:type", String)
], Account.prototype, "number", void 0);
__decorate([
    (0, core_1.Property)({ length: 100, name: 'bank_name' }),
    __metadata("design:type", String)
], Account.prototype, "bankName", void 0);
__decorate([
    (0, core_1.Property)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Account.prototype, "name", void 0);
__decorate([
    (0, core_1.Property)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Account.prototype, "description", void 0);
__decorate([
    (0, core_1.Property)({ onCreate: () => new Date(), nullable: true }),
    __metadata("design:type", Date)
], Account.prototype, "createdAt", void 0);
__decorate([
    (0, core_1.Property)({ onCreate: () => new Date(), onUpdate: () => new Date(), nullable: true }),
    __metadata("design:type", Date)
], Account.prototype, "updatedAt", void 0);
__decorate([
    (0, core_1.OneToMany)(() => transaction_entity_1.Transaction, (transaction) => transaction.account),
    __metadata("design:type", Object)
], Account.prototype, "transactions", void 0);
__decorate([
    (0, core_1.BeforeCreate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Account.prototype, "generateUid", null);
exports.Account = Account = __decorate([
    (0, core_1.Entity)({ tableName: 'accounts' })
], Account);
//# sourceMappingURL=account.entity.js.map