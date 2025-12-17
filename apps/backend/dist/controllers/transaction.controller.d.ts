import { TransactionService } from '../services/transaction.service';
import { TransactionCategoryService } from '../services/transaction-category.service';
export declare class TransactionController {
    private readonly transactionService;
    private readonly transactionCategoryService;
    constructor(transactionService: TransactionService, transactionCategoryService: TransactionCategoryService);
    updateCategory(uid: string, categoryUid: string | null): Promise<{
        uid: string;
        date: Date;
        description: string;
        amount: number;
        balance: number;
        type: "income" | "expense" | "transfer";
        category: {
            uid: string;
            name: string;
            slug: string;
        } | null;
        account: {
            uid: string;
            bsb: string;
            number: string;
            bankName: string;
            name: string | undefined;
        };
    }>;
    updateType(uid: string, type: 'income' | 'expense' | 'transfer'): Promise<{
        uid: string;
        date: Date;
        description: string;
        amount: number;
        balance: number;
        type: "income" | "expense" | "transfer";
        category: {
            uid: string;
            name: string;
            slug: string;
        } | null;
        account: {
            uid: string;
            bsb: string;
            number: string;
            bankName: string;
            name: string | undefined;
        };
    }>;
}
