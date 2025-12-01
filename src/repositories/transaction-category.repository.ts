import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { TransactionCategory } from '../entities/transaction-category.entity';

@Injectable()
export class TransactionCategoryRepository {
  constructor(private readonly em: EntityManager) {}

  async findBySlug(slug: string): Promise<TransactionCategory | null> {
    const em = this.em.fork();
    return em.findOne(TransactionCategory, { slug });
  }

  async findAllWithRules(): Promise<TransactionCategory[]> {
    const em = this.em.fork();
    return em.find(TransactionCategory, { rules: { $ne: null } });
  }
}
