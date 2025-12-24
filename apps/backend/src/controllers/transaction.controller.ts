import { Controller, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { TransactionCategoryService } from '../services/transaction-category.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../auth/user.decorator';
import { UserAccount } from '../entities/user-account.entity';

@Controller('api/transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly transactionCategoryService: TransactionCategoryService,
  ) {}

  @Patch(':uid/category')
  async updateCategory(
    @Param('uid') uid: string,
    @Body('categoryUid') categoryUid: string | null,
    @User() user: UserAccount,
  ) {
    const transaction = await this.transactionService.updateCategory(uid, categoryUid, user);

    return {
      uid: transaction.uid,
      date: transaction.transactionDate,
      description: transaction.description,
      amount: Number(transaction.amount),
      balance: Number(transaction.balance),
      type: transaction.type,
      category: transaction.category
        ? {
            uid: transaction.category.uid,
            name: transaction.category.name,
            slug: transaction.category.slug,
          }
        : null,
      account: {
        uid: transaction.account.uid,
        bsb: transaction.account.bsb,
        number: transaction.account.number,
        bankName: transaction.account.bankName,
        name: transaction.account.name,
      },
    };
  }

  @Patch(':uid/type')
  async updateType(
    @Param('uid') uid: string,
    @Body('type') type: 'income' | 'expense' | 'transfer',
    @User() user: UserAccount,
  ) {
    const transaction = await this.transactionService.updateType(uid, type, user);

    return {
      uid: transaction.uid,
      date: transaction.transactionDate,
      description: transaction.description,
      amount: Number(transaction.amount),
      balance: Number(transaction.balance),
      type: transaction.type,
      category: transaction.category
        ? {
            uid: transaction.category.uid,
            name: transaction.category.name,
            slug: transaction.category.slug,
          }
        : null,
      account: {
        uid: transaction.account.uid,
        bsb: transaction.account.bsb,
        number: transaction.account.number,
        bankName: transaction.account.bankName,
        name: transaction.account.name,
      },
    };
  }
}
