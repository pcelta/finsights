import { CommandRunner } from 'nest-commander';
import { TransactionParserService } from '../services/transaction-parser.service';
import { TransactionService } from 'src/services/transaction.service';
interface ParseTransactionsOptions {
    file?: string;
    bank?: string;
}
export declare class ParseTransactionsCommand extends CommandRunner {
    private readonly transactionParserService;
    private readonly transactionService;
    constructor(transactionParserService: TransactionParserService, transactionService: TransactionService);
    run(_passedParams: string[], options?: ParseTransactionsOptions): Promise<void>;
    private validateBankType;
    parseFile(val: string): string;
    parseBank(val: string): string;
}
export {};
