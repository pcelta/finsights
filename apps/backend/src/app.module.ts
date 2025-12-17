import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DashboardController } from './controllers/dashboard.controller';
import { TransactionController } from './controllers/transaction.controller';
import { DashboardService } from './services/dashboard.service';
import { TransactionService } from './services/transaction.service';
import { TransactionCategoryService } from './services/transaction-category.service';
import { AccountService } from './services/account.service';
import { TransactionRepository } from './repositories/transaction.repository';
import { TransactionCategoryRepository } from './repositories/transaction-category.repository';
import { AccountRepository } from './repositories/account.repository';
import config from './mikro-orm.config';

@Module({
  imports: [MikroOrmModule.forRoot(config)],
  controllers: [AppController, DashboardController, TransactionController],
  providers: [
    AppService,
    DashboardService,
    TransactionService,
    TransactionCategoryService,
    AccountService,
    TransactionRepository,
    TransactionCategoryRepository,
    AccountRepository,
  ],
})
export class AppModule {}
