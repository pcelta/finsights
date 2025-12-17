import { Account } from './account.entity';
import { TransactionCategory } from './transaction-category.entity';
export declare class Transaction {
    id: number;
    uid: string;
    description: string;
    hash: string;
    amount: number;
    balance: number;
    transactionDate: Date;
    type: 'income' | 'expense' | 'transfer';
    createdAt: Date;
    updatedAt: Date;
    account: Account;
    category?: TransactionCategory;
    generateUid(): void;
}
