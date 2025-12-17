import { AccountRepository } from '../repositories/account.repository';
import { Account } from '../entities/account.entity';
export declare class AccountService {
    private readonly accountRepository;
    constructor(accountRepository: AccountRepository);
    saveOrCreate(bsb: string, number: string, bankName: string, description?: string): Promise<Account>;
}
