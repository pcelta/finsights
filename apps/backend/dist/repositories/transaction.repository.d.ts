import { EntityManager } from '@mikro-orm/core';
import { Transaction } from '../entities/transaction.entity';
export declare class TransactionRepository {
    private readonly em;
    constructor(em: EntityManager);
    save(transaction: Transaction): Promise<Transaction>;
    findByHash(hash: string): Promise<Transaction | null>;
    findByUid(uid: string): Promise<Transaction | null>;
}
