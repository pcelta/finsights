import { Collection } from '@mikro-orm/core';
import { Transaction } from './transaction.entity';
export declare class TransactionCategory {
    id: number;
    uid: string;
    name: string;
    slug: string;
    description?: string;
    rules?: object;
    createdAt: Date;
    updatedAt: Date;
    transactions: Collection<Transaction, object>;
    generateUid(): void;
}
