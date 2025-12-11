import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class TransactionRepository {
  constructor(private readonly em: EntityManager) {}

  async save(transaction: Transaction): Promise<Transaction> {
    const em = this.em.fork();
    await em.persistAndFlush(transaction);
    return transaction;
  }

  async findByHash(hash: string): Promise<Transaction | null> {
    const em = this.em.fork();
    return em.findOne(Transaction, { hash });
  }

  async findByUid(uid: string): Promise<Transaction | null> {
    const em = this.em.fork();
    return em.findOne(Transaction, { uid }, { populate: ['category', 'account'] });
  }
}
