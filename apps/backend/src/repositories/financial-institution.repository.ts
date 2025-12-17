import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { FinancialInstitution } from '../entities/financial-institution.entity';

@Injectable()
export class FinancialInstitutionRepository {
  constructor(private readonly em: EntityManager) {}

  async save(financialInstitution: FinancialInstitution): Promise<FinancialInstitution> {
    const em = this.em.fork();
    await em.persistAndFlush(financialInstitution);
    return financialInstitution;
  }

  async findByUid(uid: string): Promise<FinancialInstitution | null> {
    const em = this.em.fork();
    return em.findOne(FinancialInstitution, { uid });
  }

  async findById(id: number): Promise<FinancialInstitution | null> {
    const em = this.em.fork();
    return em.findOne(FinancialInstitution, { id });
  }

  async findAll(): Promise<FinancialInstitution[]> {
    const em = this.em.fork();
    return em.find(FinancialInstitution, {});
  }

  async findEnabled(): Promise<FinancialInstitution[]> {
    const em = this.em.fork();
    return em.find(FinancialInstitution, { isEnabled: true });
  }

  async delete(uid: string): Promise<void> {
    const em = this.em.fork();
    const institution = await em.findOne(FinancialInstitution, { uid });
    if (institution) {
      await em.removeAndFlush(institution);
    }
  }
}
