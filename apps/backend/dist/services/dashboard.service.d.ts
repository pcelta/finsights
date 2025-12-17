import { EntityManager } from '@mikro-orm/core';
export declare class DashboardService {
    private readonly em;
    constructor(em: EntityManager);
    getSummary(startDate?: string, endDate?: string, categoryUid?: string): Promise<{
        totalExpenses: number;
        transactionCount: number;
        categoryCount: number;
        dateRange: {
            start: string | undefined;
            end: string | undefined;
        };
    }>;
    getCategoryBreakdown(startDate?: string, endDate?: string, categoryUid?: string): Promise<{
        uid: string;
        name: string;
        slug: string;
        total: number;
        count: number;
        percentage: number;
    }[]>;
    getTransactions(startDate?: string, endDate?: string, categoryUid?: string): Promise<{
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
    }[]>;
}
