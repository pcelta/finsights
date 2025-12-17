import { EntityManager } from '@mikro-orm/core';
import { Account } from '../entities/account.entity';
export declare class AccountRepository {
    private readonly em;
    constructor(em: EntityManager);
    save(account: Account): Promise<Account>;
    findByBsbAndNumber(bsb: string, number: string): Promise<Account | null>;
}
