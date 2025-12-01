import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TransactionService } from './transaction.service';
import { AccountService } from './account.service';
import { TransactionCategoryService } from './transaction-category.service';
import { TransactionRepository } from '../repositories/transaction.repository';
import { AccountRepository } from '../repositories/account.repository';
import { TransactionCategoryRepository } from '../repositories/transaction-category.repository';
import { Transaction } from '../entities/transaction.entity';
import { Account } from '../entities/account.entity';
import { TransactionCategory } from '../entities/transaction-category.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Transaction, Account, TransactionCategory])],
  providers: [
    TransactionService,
    AccountService,
    TransactionCategoryService,
    TransactionRepository,
    AccountRepository,
    TransactionCategoryRepository,
  ],
  exports: [TransactionService, AccountService, TransactionCategoryService],
})
export class ServicesModule {}
