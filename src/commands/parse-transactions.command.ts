import { Command, CommandRunner, Option } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import {
  TransactionParserService,
  BankType,
} from '../services/transaction-parser.service';

interface ParseTransactionsOptions {
  file?: string;
  bank?: string;
}

@Injectable()
@Command({
  name: 'fin:parse',
  description: 'Parse PDF bank statement and extract account details and transactions',
})
export class ParseTransactionsCommand extends CommandRunner {
  constructor(
    private readonly transactionParserService: TransactionParserService,
  ) {
    super();
  }

  async run(
    _passedParams: string[],
    options?: ParseTransactionsOptions,
  ): Promise<void> {
    try {
      const fileName = options?.file || '2025-08-29-statement.pdf';
      const bankTypeStr = options?.bank || 'ANZ';

      // Validate bank type
      const bankType = this.validateBankType(bankTypeStr);

      const pdfPath = path.join(process.cwd(), 'src', 'data', fileName);

      if (!fs.existsSync(pdfPath)) {
        console.error(`Error: PDF file not found at ${pdfPath}`);
        return;
      }

      console.log(`Parsing statement from: ${fileName}...`);
      console.log(`Bank: ${bankType}`);

      const dataBuffer = new Uint8Array(fs.readFileSync(pdfPath));
      const loadingTask = pdfjsLib.getDocument({ data: dataBuffer });
      const pdfDocument = await loadingTask.promise;

      const numPages = pdfDocument.numPages;
      let fullText = '';

      // Extract all text from PDF
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        fullText += pageText + '\n';
      }

      // Parse statement using the appropriate parser
      const statement = this.transactionParserService.parseStatement(
        fullText,
        bankType,
      );

      console.error(`Account Name: ${statement.account.accountName}`);
      console.error(
        `BSB: ${statement.account.bsb} | Account: ${statement.account.accountNumber}`,
      );
      console.error(`Period: ${statement.account.statementPeriod}`);
      console.error(
        `Opening Balance: $${statement.account.openingBalance.toFixed(2)}`,
      );
      console.error(
        `Closing Balance: $${statement.account.closingBalance.toFixed(2)}`,
      );
      console.error(`Total transactions: ${statement.transactions.length}`);
    } catch (error) {
      console.error('Error parsing statement:', error.message);
      if (error.stack) {
        console.error(error.stack);
      }
    }
  }

  private validateBankType(bankTypeStr: string): BankType {
    const upperBankType = bankTypeStr.toUpperCase();

    if (!Object.values(BankType).includes(upperBankType as BankType)) {
      const supportedBanks =
        this.transactionParserService.getSupportedBanks().join(', ');
      throw new Error(
        `Unsupported bank type: "${bankTypeStr}". Supported banks: ${supportedBanks}`,
      );
    }

    return upperBankType as BankType;
  }

  @Option({
    flags: '-f, --file <filename>',
    description:
      'PDF filename in src/data directory (default: 2025-08-29-statement.pdf)',
  })
  parseFile(val: string): string {
    return val;
  }

  @Option({
    flags: '-b, --bank <type>',
    description: 'Bank type: ANZ (default: ANZ)',
  })
  parseBank(val: string): string {
    return val;
  }
}
