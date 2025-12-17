import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { StatementProcessor } from './statement-processor';
import { StatementImportRepository } from '../repositories/statement-import.repository';
import { TransactionService } from '../services/transaction.service';
import { TransactionRepository } from '../repositories/transaction.repository';
import { AccountService } from '../services/account.service';
import { AccountRepository } from '../repositories/account.repository';
import { TransactionCategoryService } from '../services/transaction-category.service';
import { TransactionCategoryRepository } from '../repositories/transaction-category.repository';
import { ParserModule } from '../parsers/parser.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'statement-processing',
    }),
    ParserModule,
  ],
  providers: [
    StatementProcessor,
    StatementImportRepository,
    TransactionService,
    TransactionRepository,
    AccountService,
    AccountRepository,
    TransactionCategoryService,
    TransactionCategoryRepository,
  ],
  exports: [BullModule],
})
export class QueueModule {}
