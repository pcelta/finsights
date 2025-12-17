import { BankStatement } from '../parsers/interfaces';
import { TransactionRepository } from '../repositories/transaction.repository';
import { AccountService } from './account.service';
import { Transaction } from 'src/entities/transaction.entity';
import { TransactionCategoryService } from './transaction-category.service';
export declare class TransactionService {
    private readonly transactionRepository;
    private readonly accountService;
    private readonly transactionCategoryService;
    constructor(transactionRepository: TransactionRepository, accountService: AccountService, transactionCategoryService: TransactionCategoryService);
    private generateHash;
    ingest(bankStatement: BankStatement): Promise<void>;
    updateCategory(transactionUid: string, categoryUid: string | null): Promise<Transaction>;
    updateType(transactionUid: string, type: 'income' | 'expense' | 'transfer'): Promise<Transaction>;
}
