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
exports.TransactionRepository = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@mikro-orm/core");
const transaction_entity_1 = require("../entities/transaction.entity");
let TransactionRepository = class TransactionRepository {
    em;
    constructor(em) {
        this.em = em;
    }
    async save(transaction) {
        const em = this.em.fork();
        await em.persistAndFlush(transaction);
        return transaction;
    }
    async findByHash(hash) {
        const em = this.em.fork();
        return em.findOne(transaction_entity_1.Transaction, { hash });
    }
    async findByUid(uid) {
        const em = this.em.fork();
        return em.findOne(transaction_entity_1.Transaction, { uid }, { populate: ['category', 'account'] });
    }
};
exports.TransactionRepository = TransactionRepository;
exports.TransactionRepository = TransactionRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.EntityManager])
], TransactionRepository);
//# sourceMappingURL=transaction.repository.js.map