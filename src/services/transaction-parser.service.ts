import { Injectable } from '@nestjs/common';
import { ANZParser } from '../parsers/anz.parser';
import {
  BankStatementParser,
  BankStatement,
} from '../parsers/interfaces';

export enum BankType {
  ANZ = 'ANZ',
  // Add more banks here as needed
  // NAB = 'NAB',
  // WESTPAC = 'WESTPAC',
  // CBA = 'CBA',
}

@Injectable()
export class TransactionParserService {
  private parsers: Map<BankType, BankStatementParser>;

  constructor(private readonly anzParser: ANZParser) {
    this.parsers = new Map<BankType, BankStatementParser>([
      [BankType.ANZ, this.anzParser],
      // Add more parsers here as they are implemented
    ]);
  }

  parseStatement(text: string, bankType: BankType): BankStatement {
    const parser = this.getParser(bankType);
    return parser.parseStatement(text);
  }

  private getParser(bankType: BankType): BankStatementParser {
    const parser = this.parsers.get(bankType);

    if (!parser) {
      throw new Error(
        `Parser for bank type "${bankType}" is not implemented. Available parsers: ${Array.from(this.parsers.keys()).join(', ')}`,
      );
    }

    return parser;
  }

  getSupportedBanks(): BankType[] {
    return Array.from(this.parsers.keys());
  }
}
