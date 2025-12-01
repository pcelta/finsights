import { Injectable } from '@nestjs/common';
import {
  BankStatementParser,
  BankStatement,
  AccountDetails,
  Transaction,
} from './interfaces';

@Injectable()
export class ANZParser implements BankStatementParser {
  parseStatement(text: string): BankStatement {
    const account = this.parseAccountDetails(text);

    // Extract year from statement period
    const year = this.extractYearFromStatementPeriod(text);

    const transactions = this.parseTransactionsWithYear(text, year);

    return {
      account,
      transactions,
    };
  }

  private extractYearFromStatementPeriod(text: string): number {
    // Extract statement period to get the year
    const periodMatch = text.match(
      /Account Statement\s+(\d{1,2}\s+\w+\s+\d{4})\s*-\s*(\d{1,2}\s+\w+\s+(\d{4}))/i,
    );

    if (periodMatch && periodMatch[3]) {
      return parseInt(periodMatch[3], 10);
    }

    // Fallback to current year if not found
    return new Date().getFullYear();
  }

  parseAccountDetails(text: string): AccountDetails {
    // Extract statement period
    const periodMatch = text.match(
      /Account Statement\s+(\d{1,2}\s+\w+\s+\d{4})\s*-\s*(\d{1,2}\s+\w+\s+\d{4})/i,
    );
    const statementPeriod = periodMatch
      ? `${periodMatch[1]} - ${periodMatch[2]}`
      : '';

    // Extract account type
    const accountTypeMatch = text.match(
      /(ANZ Plus Everyday|ANZ Plus Save|ANZ [A-Za-z\s]+)\s+Branch Number/i,
    );
    const accountType = accountTypeMatch
      ? accountTypeMatch[1].trim()
      : 'Unknown';

    // Extract BSB
    const bsbMatch = text.match(
      /Branch Number \(BSB\)\s+Account Number\s+Opening Balance\s+Closing Balance\s+(\d{3}\s+\d{3})/i,
    );
    const bsb = bsbMatch ? bsbMatch[1].replace(/\s+/g, '') : '';

    // Extract Account Number
    const accountNumberMatch = text.match(
      /(\d{3}\s+\d{3})\s+(\d{3}\s+\d{3}\s+\d{3})\s+\$/,
    );
    const accountNumber = accountNumberMatch
      ? accountNumberMatch[2].replace(/\s+/g, '')
      : '';

    // Extract Opening Balance
    const openingBalanceMatch = text.match(
      /Opening Balance\s+Closing Balance\s+\d{3}\s+\d{3}\s+\d{3}\s+\d{3}\s+\d{3}\s+\$([\d,]+\.\d{2})/,
    );
    const openingBalance = openingBalanceMatch
      ? this.parseAmount(openingBalanceMatch[1])
      : 0;

    // Extract Closing Balance
    const closingBalanceMatch = text.match(
      /\$([\d,]+\.\d{2})\s+\$([\d,]+\.\d{2})\s+Account Name/,
    );
    const closingBalance = closingBalanceMatch
      ? this.parseAmount(closingBalanceMatch[2])
      : 0;

    // Extract Account Name
    const accountNameMatch = text.match(
      /Account Name\s+([A-Z\s]+?)(?=\s+Transactions|$)/,
    );
    const accountName = accountNameMatch ? accountNameMatch[1].trim() : '';

    return {
      bankName: 'ANZ',
      accountName,
      accountType,
      bsb,
      accountNumber,
      openingBalance,
      closingBalance,
      statementPeriod,
    };
  }

  parseTransactions(text: string): Transaction[] {
    const year = this.extractYearFromStatementPeriod(text);
    return this.parseTransactionsWithYear(text, year);
  }

  private parseTransactionsWithYear(text: string, year: number): Transaction[] {
    const transactions: Transaction[] = [];

    // ANZ-specific transaction pattern
    // Looking for: Date (DD Mon) followed by description and dollar amounts
    const transactionRegex =
      /(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\s+(.+?)(?=\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)|$)/gi;

    let match;
    while ((match = transactionRegex.exec(text)) !== null) {
      const dateStr = match[1].trim();
      const content = match[2].trim();

      // Append year to the date string
      const date = `${dateStr} ${year}`;

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
    return creditKeywords.some((keyword) => upperDesc.includes(keyword));
  }
}
