export interface Transaction {
    date: string;
    description: string;
    credit?: number;
    debit?: number;
    balance: number;
}
export interface AccountDetails {
    bankName: string;
    accountName: string;
    accountType: string;
    bsb: string;
    accountNumber: string;
    openingBalance: number;
    closingBalance: number;
    statementPeriod: string;
}
export interface BankStatement {
    account: AccountDetails;
    transactions: Transaction[];
}
export interface BankStatementParser {
    parseStatement(text: string): BankStatement;
    parseAccountDetails(text: string): AccountDetails;
    parseTransactions(text: string): Transaction[];
}
