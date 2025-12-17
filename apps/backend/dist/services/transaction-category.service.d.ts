import { TransactionCategoryRepository } from '../repositories/transaction-category.repository';
import { TransactionCategory } from '../entities/transaction-category.entity';
export declare class TransactionCategoryService {
    private readonly transactionCategoryRepository;
    private ajv;
    private categories;
    constructor(transactionCategoryRepository: TransactionCategoryRepository);
    private getCategories;
    findOut(transactionDescription: string): Promise<TransactionCategory | null>;
    findByUid(uid: string): Promise<TransactionCategory | null>;
    findAll(): Promise<TransactionCategory[]>;
}
