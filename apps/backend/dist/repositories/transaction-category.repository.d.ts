import { EntityManager } from '@mikro-orm/core';
import { TransactionCategory } from '../entities/transaction-category.entity';
export declare class TransactionCategoryRepository {
    private readonly em;
    constructor(em: EntityManager);
    findBySlug(slug: string): Promise<TransactionCategory | null>;
    findAllWithRules(): Promise<TransactionCategory[]>;
    findByUid(uid: string): Promise<TransactionCategory | null>;
    findAll(): Promise<TransactionCategory[]>;
}
