import { Collection } from '@mikro-orm/core';
import { Transaction } from './transaction.entity';
export declare class Account {
    id: number;
    uid: string;
    bsb: string;
    number: string;
    bankName: string;
    name?: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    transactions: Collection<Transaction, object>;
    generateUid(): void;
}
