import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { BankStatement } from '../parsers/interfaces';
import { TransactionRepository } from '../repositories/transaction.repository';
import { AccountService } from './account.service';
import { Transaction } from 'src/entities/transaction.entity';
import { TransactionCategoryService } from './transaction-category.service';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountService: AccountService,
    private readonly transactionCategoryService: TransactionCategoryService,
  ) {}

  private generateHash(
    description: string,
    amount: number,
    date: string,
    accountId: number,
  ): string {
    const data = `${description}:${amount}:${date}:${accountId}`;
    return createHash('sha256').update(data).digest('hex');
  }

  async ingest(bankStatement: BankStatement): Promise<void> {
    const account = await this.accountService.saveOrCreate(
      bankStatement.account.bsb,
      bankStatement.account.accountNumber,
      bankStatement.account.bankName,
    );

    for (const statementTransaction of bankStatement.transactions) {
      const amount = statementTransaction.debit ?? 0;
      const hash = this.generateHash(
        statementTransaction.description,
        amount,
        statementTransaction.date,
        account.id,
      );

      const existingTransaction = await this.transactionRepository.findByHash(hash);
      if (existingTransaction) {
        continue;
      }

      const category = await this.transactionCategoryService.findOut(
        statementTransaction.description,
      );

      const transaction = new Transaction();
      transaction.account = account;
      transaction.amount = amount;
      transaction.balance = statementTransaction.balance;
      transaction.description = statementTransaction.description;
      transaction.transactionDate = new Date(statementTransaction.date);
      transaction.hash = hash;
      transaction.category = category ?? undefined;

      await this.transactionRepository.save(transaction);
    }
  }
}
