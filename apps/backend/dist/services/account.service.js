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
exports.AccountService = void 0;
const common_1 = require("@nestjs/common");
const account_repository_1 = require("../repositories/account.repository");
const account_entity_1 = require("../entities/account.entity");
let AccountService = class AccountService {
    accountRepository;
    constructor(accountRepository) {
        this.accountRepository = accountRepository;
    }
    async saveOrCreate(bsb, number, bankName, description) {
        const existingAccount = await this.accountRepository.findByBsbAndNumber(bsb, number);
        if (existingAccount) {
            return existingAccount;
        }
        const account = new account_entity_1.Account();
        account.bsb = bsb;
        account.number = number;
        account.bankName = bankName;
        account.description = description;
        return this.accountRepository.save(account);
    }
};
exports.AccountService = AccountService;
exports.AccountService = AccountService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [account_repository_1.AccountRepository])
], AccountService);
//# sourceMappingURL=account.service.js.map