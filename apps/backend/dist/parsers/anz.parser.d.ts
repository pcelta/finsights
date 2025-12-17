import { BankStatementParser, BankStatement, AccountDetails, Transaction } from './interfaces';
export declare class ANZParser implements BankStatementParser {
    parseStatement(text: string): BankStatement;
    private extractYearFromStatementPeriod;
    parseAccountDetails(text: string): AccountDetails;
    parseTransactions(text: string): Transaction[];
    private parseTransactionsWithYear;
    private parseAmount;
    private isCredit;
}
