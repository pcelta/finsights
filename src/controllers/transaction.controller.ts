import { Controller, Patch, Param, Body } from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { TransactionCategoryService } from '../services/transaction-category.service';

@Controller('api/transactions')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly transactionCategoryService: TransactionCategoryService,
  ) {}

  @Patch(':uid/category')
  async updateCategory(
    @Param('uid') uid: string,
    @Body('categoryUid') categoryUid: string | null,
  ) {
    const transaction = await this.transactionService.updateCategory(uid, categoryUid);

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
