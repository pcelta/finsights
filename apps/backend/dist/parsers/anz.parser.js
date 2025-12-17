"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ANZParser = void 0;
const common_1 = require("@nestjs/common");
let ANZParser = class ANZParser {
    parseStatement(text) {
        const account = this.parseAccountDetails(text);
        const year = this.extractYearFromStatementPeriod(text);
        const transactions = this.parseTransactionsWithYear(text, year);
        return {
            account,
            transactions,
        };
    }
    extractYearFromStatementPeriod(text) {
        const periodMatch = text.match(/Account Statement\s+(\d{1,2}\s+\w+\s+\d{4})\s*-\s*(\d{1,2}\s+\w+\s+(\d{4}))/i);
        if (periodMatch && periodMatch[3]) {
            return parseInt(periodMatch[3], 10);
        }
        return new Date().getFullYear();
    }
    parseAccountDetails(text) {
        const periodMatch = text.match(/Account Statement\s+(\d{1,2}\s+\w+\s+\d{4})\s*-\s*(\d{1,2}\s+\w+\s+\d{4})/i);
        const statementPeriod = periodMatch
            ? `${periodMatch[1]} - ${periodMatch[2]}`
            : '';
        const accountTypeMatch = text.match(/(ANZ Plus Everyday|ANZ Plus Save|ANZ [A-Za-z\s]+)\s+Branch Number/i);
        const accountType = accountTypeMatch
            ? accountTypeMatch[1].trim()
            : 'Unknown';
        const bsbMatch = text.match(/Branch Number \(BSB\)\s+Account Number\s+Opening Balance\s+Closing Balance\s+(\d{3}\s+\d{3})/i);
        const bsb = bsbMatch ? bsbMatch[1].replace(/\s+/g, '') : '';
        const accountNumberMatch = text.match(/(\d{3}\s+\d{3})\s+(\d{3}\s+\d{3}\s+\d{3})\s+\$/);
        const accountNumber = accountNumberMatch
            ? accountNumberMatch[2].replace(/\s+/g, '')
            : '';
        const openingBalanceMatch = text.match(/Opening Balance\s+Closing Balance\s+\d{3}\s+\d{3}\s+\d{3}\s+\d{3}\s+\d{3}\s+\$([\d,]+\.\d{2})/);
        const openingBalance = openingBalanceMatch
            ? this.parseAmount(openingBalanceMatch[1])
            : 0;
        const closingBalanceMatch = text.match(/\$([\d,]+\.\d{2})\s+\$([\d,]+\.\d{2})\s+Account Name/);
        const closingBalance = closingBalanceMatch
            ? this.parseAmount(closingBalanceMatch[2])
            : 0;
        const accountNameMatch = text.match(/Account Name\s+([A-Z\s]+?)(?=\s+Transactions|$)/);
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
    parseTransactions(text) {
        const year = this.extractYearFromStatementPeriod(text);
        return this.parseTransactionsWithYear(text, year);
    }
    parseTransactionsWithYear(text, year) {
        const transactions = [];
        const transactionRegex = /(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\s+(.+?)(?=\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)|$)/gi;
        let match;
        while ((match = transactionRegex.exec(text)) !== null) {
            const dateStr = match[1].trim();
            const content = match[2].trim();
            const date = `${dateStr} ${year}`;
            const amounts = content.match(/\$[\d,]+\.\d{2}/g);
            if (amounts && amounts.length > 0) {
                const balance = this.parseAmount(amounts[amounts.length - 1]);
                let description = content;
                amounts.forEach((amt) => {
                    description = description.replace(amt, '');
                });
                description = description.replace(/\s+/g, ' ').trim();
                let credit;
                let debit;
                if (amounts.length === 2) {
                    const amount = this.parseAmount(amounts[0]);
                    if (this.isCredit(description)) {
                        credit = amount;
                    }
                    else {
                        debit = amount;
                    }
                }
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
    parseAmount(amountStr) {
        return parseFloat(amountStr.replace(/[$,]/g, ''));
    }
    isCredit(description) {
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
};
exports.ANZParser = ANZParser;
exports.ANZParser = ANZParser = __decorate([
    (0, common_1.Injectable)()
], ANZParser);
//# sourceMappingURL=anz.parser.js.map