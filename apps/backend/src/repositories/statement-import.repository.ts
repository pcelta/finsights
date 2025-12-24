import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { StatementImport, StatementImportStatus } from '../entities/statement-import.entity';

@Injectable()
export class StatementImportRepository {
  constructor(private readonly em: EntityManager) {}

  async save(statementImport: StatementImport): Promise<StatementImport> {
    const em = this.em.fork();
    await em.persistAndFlush(statementImport);
    return statementImport;
  }

  async findByUid(uid: string): Promise<StatementImport | null> {
    const em = this.em.fork();
    return em.findOne(
      StatementImport,
      { uid },
      { populate: ['financialInstitution', 'userAccount'] }
    );
  }

  async findById(id: number): Promise<StatementImport | null> {
    const em = this.em.fork();
    return em.findOne(
      StatementImport,
      { id },
      { populate: ['financialInstitution'] }
    );
  }

  async findAll(): Promise<StatementImport[]> {
    const em = this.em.fork();
    return em.find(
      StatementImport,
      {},
      { populate: ['financialInstitution'], orderBy: { createdAt: 'DESC' } }
    );
  }

  async findByStatus(status: StatementImportStatus): Promise<StatementImport[]> {
    const em = this.em.fork();
    return em.find(
      StatementImport,
      { status },
      { populate: ['financialInstitution'], orderBy: { createdAt: 'DESC' } }
    );
  }

  async updateStatus(
    uid: string,
    status: StatementImportStatus,
    error?: string
  ): Promise<StatementImport | null> {
    const em = this.em.fork();
    const statementImport = await em.findOne(StatementImport, { uid });
    if (!statementImport) {
      return null;
    }

    statementImport.status = status;
    if (error !== undefined) {
      statementImport.error = error;
    }

    await em.flush();
    return statementImport;
  }

  async delete(uid: string): Promise<void> {
    const em = this.em.fork();
    const statementImport = await em.findOne(StatementImport, { uid });
    if (statementImport) {
      await em.removeAndFlush(statementImport);
    }
  }
}
