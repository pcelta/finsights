import { ANZParser } from '../parsers/anz.parser';
import { BankStatement } from '../parsers/interfaces';
export declare enum BankType {
    ANZ = "ANZ"
}
export declare class TransactionParserService {
    private readonly anzParser;
    private parsers;
    constructor(anzParser: ANZParser);
    parseStatement(text: string, bankType: BankType): BankStatement;
    private getParser;
    getSupportedBanks(): BankType[];
}
