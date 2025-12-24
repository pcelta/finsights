import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { UserAccountActivation } from '../entities/user-account-activation.entity';

@Injectable()
export class UserAccountActivationRepository {
  constructor(private readonly em: EntityManager) {}

  async save(
    activation: UserAccountActivation,
  ): Promise<UserAccountActivation> {
    const em = this.em.fork();
    await em.persistAndFlush(activation);
    return activation;
  }

  async findByCode(code: string): Promise<UserAccountActivation | null> {
    const em = this.em.fork();
    return em.findOne(
      UserAccountActivation,
      { code },
      { populate: ['userAccount'] },
    );
  }

  async deleteExpired(): Promise<number> {
    const em = this.em.fork();
    const result = await em.nativeDelete(UserAccountActivation, {
      expiresAt: { $lt: new Date() },
    });
    return result;
  }
}
