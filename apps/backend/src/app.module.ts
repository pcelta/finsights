import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DashboardController } from './controllers/dashboard.controller';
import { TransactionController } from './controllers/transaction.controller';
import { ImportController } from './controllers/import.controller';
import { FinancialInstitutionController } from './controllers/financial-institution.controller';
import { UserAccountController } from './controllers/user-account.controller';
import { DashboardService } from './services/dashboard.service';
import { TransactionService } from './services/transaction.service';
import { TransactionCategoryService } from './services/transaction-category.service';
import { AccountService } from './services/account.service';
import { FinancialInstitutionService } from './services/financial-institution.service';
import { StatementImportService } from './services/statement-import.service';
import { UserAccountService } from './services/user-account.service';
import { EmailService } from './services/email.service';
import { TokenService } from './services/token.service';
import { TransactionRepository } from './repositories/transaction.repository';
import { TransactionCategoryRepository } from './repositories/transaction-category.repository';
import { AccountRepository } from './repositories/account.repository';
import { FinancialInstitutionRepository } from './repositories/financial-institution.repository';
import { StatementImportRepository } from './repositories/statement-import.repository';
import { UserAccountRepository } from './repositories/user-account.repository';
import { UserAccountTokenRepository } from './repositories/user-account-token.repository';
import { UserAccountActivationRepository } from './repositories/user-account-activation.repository';
import { QueueModule } from './queue/queue.module';
import { AuthModule } from './auth/auth.module';
import config from './mikro-orm.config';

@Module({
  imports: [
    MikroOrmModule.forRoot(config),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
    QueueModule,
    AuthModule,
  ],
  controllers: [
    AppController,
    DashboardController,
    TransactionController,
    ImportController,
    FinancialInstitutionController,
    UserAccountController,
  ],
  providers: [
    AppService,
    DashboardService,
    TransactionService,
    TransactionCategoryService,
    AccountService,
    FinancialInstitutionService,
    StatementImportService,
    TransactionRepository,
    TransactionCategoryRepository,
    AccountRepository,
    FinancialInstitutionRepository,
    StatementImportRepository,
    UserAccountService,
    UserAccountRepository,
    UserAccountTokenRepository,
    UserAccountActivationRepository,
    EmailService,
    TokenService,
  ],
})
export class AppModule {}
