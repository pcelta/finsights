import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { BankStatement } from '../parsers/interfaces';
import { TransactionRepository } from '../repositories/transaction.repository';
import { AccountService } from './account.service';
import { Transaction } from 'src/entities/transaction.entity';
import { TransactionCategoryService } from './transaction-category.service';
import { UserAccount } from '../entities/user-account.entity';

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

  async ingest(bankStatement: BankStatement, userAccount: UserAccount): Promise<void> {
    const account = await this.accountService.saveOrCreate(
      bankStatement.account.bsb,
      bankStatement.account.accountNumber,
      bankStatement.account.bankName,
      userAccount,
    );

    for (const statementTransaction of bankStatement.transactions) {
      const amount = statementTransaction.debit ?? statementTransaction.credit ?? 0;
      let type: 'expense' | 'income' | 'transfer' = statementTransaction.debit ? 'expense' : 'income';
      if (statementTransaction.description.match(/^TRANSFER\ (TO|FROM)/i)) {
        type = "transfer";
      }

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
        userAccount,
      );

      const transaction = new Transaction();
      transaction.account = account;
      transaction.amount = amount;
      transaction.balance = statementTransaction.balance;
      transaction.description = statementTransaction.description;
      transaction.transactionDate = new Date(statementTransaction.date);
      transaction.hash = hash;
      transaction.type = type;
      transaction.category = category ?? undefined;

      await this.transactionRepository.save(transaction);
    }
  }

  async updateCategory(transactionUid: string, categoryUid: string | null, userAccount: UserAccount): Promise<Transaction> {
    const transaction = await this.transactionRepository.findByUid(transactionUid);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Validate ownership - transaction belongs to user through account relationship
    if (transaction.account.userAccount.id !== userAccount.id) {
      throw new Error('Unauthorized: Transaction does not belong to this user');
    }

    if (categoryUid) {
      const category = await this.transactionCategoryService.findByUid(categoryUid, userAccount.id);
      if (!category) {
        throw new Error('Category not found');
      }
      transaction.category = category;
    } else {
      transaction.category = undefined;
    }

    return this.transactionRepository.save(transaction);
  }

  async updateType(transactionUid: string, type: 'income' | 'expense' | 'transfer', userAccount: UserAccount): Promise<Transaction> {
    const transaction = await this.transactionRepository.findByUid(transactionUid);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Validate ownership - transaction belongs to user through account relationship
    if (transaction.account.userAccount.id !== userAccount.id) {
      throw new Error('Unauthorized: Transaction does not belong to this user');
    }

    if (!['income', 'expense', 'transfer'].includes(type)) {
      throw new Error('Invalid transaction type');
    }

    transaction.type = type;
    return this.transactionRepository.save(transaction);
  }
}
