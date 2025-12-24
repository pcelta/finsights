import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { TransactionCategory } from '../entities/transaction-category.entity';

@Injectable()
export class TransactionCategoryRepository {
  constructor(private readonly em: EntityManager) {}

  async findBySlug(slug: string, userAccountId: number): Promise<TransactionCategory | null> {
    const em = this.em.fork();
    return em.findOne(TransactionCategory, { slug, userAccount: userAccountId });
  }

  async findAllWithRules(userAccountId: number): Promise<TransactionCategory[]> {
    const em = this.em.fork();
    return em.find(TransactionCategory, {
      rules: { $ne: null },
      userAccount: userAccountId
    });
  }

  async findByUid(uid: string, userAccountId: number): Promise<TransactionCategory | null> {
    const em = this.em.fork();
    return em.findOne(TransactionCategory, { uid, userAccount: userAccountId });
  }

  async findAll(userAccountId: number): Promise<TransactionCategory[]> {
    const em = this.em.fork();
    return em.find(TransactionCategory, { userAccount: userAccountId });
  }
}
