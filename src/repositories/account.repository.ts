import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Account } from '../entities/account.entity';

@Injectable()
export class AccountRepository {
  constructor(private readonly em: EntityManager) {}

  async save(account: Account): Promise<Account> {
    const em = this.em.fork();
    await em.persistAndFlush(account);
    return account;
  }

  async findByBsbAndNumber(
    bsb: string,
    number: string,
  ): Promise<Account | null> {
    const em = this.em.fork();
    return em.findOne(Account, { bsb, number });
  }
}
