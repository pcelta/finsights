import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { UserAccount } from '../entities/user-account.entity';

@Injectable()
export class UserAccountRepository {
  constructor(private readonly em: EntityManager) {}

  async save(userAccount: UserAccount): Promise<UserAccount> {
    const em = this.em.fork();
    await em.persistAndFlush(userAccount);
    return userAccount;
  }

  async findByEmail(email: string): Promise<UserAccount | null> {
    const em = this.em.fork();
    return em.findOne(UserAccount, { email });
  }

  async findByUid(uid: string): Promise<UserAccount | null> {
    const em = this.em.fork();
    return em.findOne(UserAccount, { uid });
  }
}
