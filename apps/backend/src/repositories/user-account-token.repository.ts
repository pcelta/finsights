import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { UserAccountToken } from '../entities/user-account-token.entity';

@Injectable()
export class UserAccountTokenRepository {
  constructor(private readonly em: EntityManager) {}

  async save(token: UserAccountToken): Promise<UserAccountToken> {
    const em = this.em.fork();
    await em.persistAndFlush(token);
    return token;
  }

  async findByToken(token: string): Promise<UserAccountToken | null> {
    const em = this.em.fork();
    return em.findOne(
      UserAccountToken,
      { token },
      { populate: ['userAccount'] },
    );
  }

  async deleteExpiredTokens(): Promise<number> {
    const em = this.em.fork();
    const result = await em.nativeDelete(UserAccountToken, {
      expiresAt: { $lt: new Date() },
    });
    return result;
  }
}
