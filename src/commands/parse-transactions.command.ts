import { Command, CommandRunner, Option } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

interface Transaction {
  date: string;
  description: string;
  credit?: number;
  debit?: number;
  balance: number;
}

interface AccountDetails {
  accountName: string;
  accountType: string;
  bsb: string;
  accountNumber: string;
  openingBalance: number;
  closingBalance: number;
  statementPeriod: string;
}

interface BankStatement {
  account: AccountDetails;
  transactions: Transaction[];
}

interface ParseTransactionsOptions {
  file?: string;
  output?: 'json' | 'csv';
}

@Injectable()
@Command({
  name: 'fin:parse',
  description: 'Parse PDF bank statement and extract account details and transactions',
})
export class ParseTransactionsCommand extends CommandRunner {
  constructor() {
    super();
  }

  async run(
    _passedParams: string[],
    options?: ParseTransactionsOptions,
  ): Promise<void> {
    try {
      const fileName = options?.file || '2025-08-29-statement.pdf';
      const outputFormat = options?.output || 'json';

      const pdfPath = path.join(process.cwd(), 'src', 'data', fileName);

      if (!fs.existsSync(pdfPath)) {
        console.error(`Error: PDF file not found at ${pdfPath}`);
        return;
      }

      console.log(`Parsing statement from: ${fileName}...`);
      console.log('');

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

      // Parse account details and transactions
      const accountDetails = this.parseAccountDetails(fullText);
      const transactions = this.parseTransactions(fullText);

      const statement: BankStatement = {
        account: accountDetails,
        transactions,
      };

      if (outputFormat === 'csv') {
        this.outputCsv(statement);
      } else {
        console.log(JSON.stringify(statement, null, 2));
      }
    } catch (error) {
      console.error('Error parsing statement:', error.message);
      if (error.stack) {
        console.error(error.stack);
      }
    }
  }

  private parseAccountDetails(text: string): AccountDetails {
    // Extract statement period
    const periodMatch = text.match(/Account Statement\s+(\d{1,2}\s+\w+\s+\d{4})\s*-\s*(\d{1,2}\s+\w+\s+\d{4})/i);
    const statementPeriod = periodMatch
      ? `${periodMatch[1]} - ${periodMatch[2]}`
      : '';

    // Extract account type
    const accountTypeMatch = text.match(/(ANZ Plus Everyday|ANZ Plus Save|ANZ [A-Za-z\s]+)\s+Branch Number/i);
    const accountType = accountTypeMatch ? accountTypeMatch[1].trim() : 'Unknown';

    // Extract BSB
    const bsbMatch = text.match(/Branch Number \(BSB\)\s+Account Number\s+Opening Balance\s+Closing Balance\s+(\d{3}\s+\d{3})/i);
    const bsb = bsbMatch ? bsbMatch[1].replace(/\s+/g, '-') : '';

    // Extract Account Number
    const accountNumberMatch = text.match(/(\d{3}\s+\d{3})\s+(\d{3}\s+\d{3}\s+\d{3})\s+\$/);
    const accountNumber = accountNumberMatch
      ? accountNumberMatch[2].replace(/\s+/g, '')
      : '';

    // Extract Opening Balance
    const openingBalanceMatch = text.match(/Opening Balance\s+Closing Balance\s+\d{3}\s+\d{3}\s+\d{3}\s+\d{3}\s+\d{3}\s+\$([\d,]+\.\d{2})/);
    const openingBalance = openingBalanceMatch
      ? this.parseAmount(openingBalanceMatch[1])
      : 0;

    // Extract Closing Balance
    const closingBalanceMatch = text.match(/\$([\d,]+\.\d{2})\s+\$([\d,]+\.\d{2})\s+Account Name/);
    const closingBalance = closingBalanceMatch
      ? this.parseAmount(closingBalanceMatch[2])
      : 0;

    // Extract Account Name
    const accountNameMatch = text.match(/Account Name\s+([A-Z\s]+?)(?=\s+Transactions|$)/);
    const accountName = accountNameMatch ? accountNameMatch[1].trim() : '';

    return {
      accountName,
      accountType,
      bsb,
      accountNumber,
      openingBalance,
      closingBalance,
      statementPeriod,
    };
  }

  private parseTransactions(text: string): Transaction[] {
    const transactions: Transaction[] = [];

    // Improved regex to match transaction patterns
    // Looking for: Date (DD Mon) followed by description and dollar amounts
    const transactionRegex = /(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\s+(.+?)(?=\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)|$)/gi;

    let match;
    while ((match = transactionRegex.exec(text)) !== null) {
      const date = match[1].trim();
      const content = match[2].trim();

      // Extract all dollar amounts from the content
      const amounts = content.match(/\$[\d,]+\.\d{2}/g);

      if (amounts && amounts.length > 0) {
        // The last amount is always the balance
        const balance = this.parseAmount(amounts[amounts.length - 1]);

        // Remove amounts from description to get clean text
        let description = content;
        amounts.forEach((amt: string) => {
          description = description.replace(amt, '');
        });

        // Clean up extra spaces
        description = description.replace(/\s+/g, ' ').trim();

        // Determine credit/debit
        let credit: number | undefined;
        let debit: number | undefined;

        if (amounts.length === 2) {
          const amount = this.parseAmount(amounts[0]);

          if (this.isCredit(description)) {
            credit = amount;
          } else {
            debit = amount;
          }
        }

        // Only add if we have a valid transaction
        if (description && balance) {
          transactions.push({
            date,
            description,
            credit,
            debit,
            balance,
          });
        }
      }
    }

    return transactions;
  }

  private parseAmount(amountStr: string): number {
    return parseFloat(amountStr.replace(/[$,]/g, ''));
  }

  private isCredit(description: string): boolean {
    const creditKeywords = [
      'TRANSFER FROM',
      'PAYMENT FROM',
      'PAY/SALARY',
      'DEPOSIT',
      'CREDIT',
      'REFUND',
    ];

    const upperDesc = description.toUpperCase();
    return creditKeywords.some(keyword => upperDesc.includes(keyword));
  }

  private outputCsv(statement: BankStatement): void {
    // Output account details as CSV header comments
    console.log(`# Account Name: ${statement.account.accountName}`);
    console.log(`# Account Type: ${statement.account.accountType}`);
    console.log(`# BSB: ${statement.account.bsb}`);
    console.log(`# Account Number: ${statement.account.accountNumber}`);
    console.log(`# Statement Period: ${statement.account.statementPeriod}`);
    console.log(`# Opening Balance: ${statement.account.openingBalance.toFixed(2)}`);
    console.log(`# Closing Balance: ${statement.account.closingBalance.toFixed(2)}`);
    console.log('');
    console.log('Date,Description,Credit,Debit,Balance');

    statement.transactions.forEach(tx => {
      const credit = tx.credit !== undefined ? tx.credit.toFixed(2) : '';
      const debit = tx.debit !== undefined ? tx.debit.toFixed(2) : '';
      const balance = tx.balance.toFixed(2);
      const description = `"${tx.description.replace(/"/g, '""')}"`;

      console.log(`${tx.date},${description},${credit},${debit},${balance}`);
    });
  }

  @Option({
    flags: '-f, --file <filename>',
    description: 'PDF filename in src/data directory (default: 2025-08-29-statement.pdf)',
  })
  parseFile(val: string): string {
    return val;
  }

  @Option({
    flags: '-o, --output <format>',
    description: 'Output format: json or csv (default: json)',
  })
  parseOutput(val: string): 'json' | 'csv' {
    if (val !== 'json' && val !== 'csv') {
      throw new Error('Output format must be either "json" or "csv"');
    }
    return val;
  }
}
