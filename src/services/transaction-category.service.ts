import { Injectable } from '@nestjs/common';
import { TransactionCategoryRepository } from '../repositories/transaction-category.repository';
import { TransactionCategory } from '../entities/transaction-category.entity';

@Injectable()
export class TransactionCategoryService {
  constructor(
    private readonly transactionCategoryRepository: TransactionCategoryRepository,
  ) {}

  async findOut(
    transactionDescription: string,
  ): Promise<TransactionCategory | null> {
    return this.transactionCategoryRepository.findBySlug('other');
  }
}
