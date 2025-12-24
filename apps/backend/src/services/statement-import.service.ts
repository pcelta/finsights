import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { StatementImport, StatementImportStatus } from '../entities/statement-import.entity';
import { StatementImportRepository } from '../repositories/statement-import.repository';
import { FinancialInstitutionService } from './financial-institution.service';
import { UserAccount } from '../entities/user-account.entity';

@Injectable()
export class StatementImportService {
  constructor(
    private readonly statementImportRepository: StatementImportRepository,
    private readonly financialInstitutionService: FinancialInstitutionService,
    @InjectQueue('statement-processing') private readonly queue: Queue,
  ) {}

  async create(
    financialInstitutionUid: string,
    filePath: string,
    userAccount: UserAccount,
  ): Promise<StatementImport> {
    const financialInstitution = await this.financialInstitutionService.findByUid(
      financialInstitutionUid
    );

    const statementImport = new StatementImport();
    statementImport.financialInstitution = financialInstitution;
    statementImport.userAccount = userAccount;
    statementImport.path = filePath;
    statementImport.status = StatementImportStatus.PENDING;

    const savedImport = await this.statementImportRepository.save(statementImport);

    // Add job to queue for processing
    await this.queue.add({
      statementImportUid: savedImport.uid,
    });

    return savedImport;
  }

  async findByUid(uid: string): Promise<StatementImport> {
    const statementImport = await this.statementImportRepository.findByUid(uid);
    if (!statementImport) {
      throw new NotFoundException(`Statement import with UID ${uid} not found`);
    }
    return statementImport;
  }

  async findAll(): Promise<StatementImport[]> {
    return this.statementImportRepository.findAll();
  }

  async findByStatus(status: StatementImportStatus): Promise<StatementImport[]> {
    return this.statementImportRepository.findByStatus(status);
  }

  async updateStatus(
    uid: string,
    status: StatementImportStatus,
    error?: string
  ): Promise<StatementImport> {
    const statementImport = await this.statementImportRepository.updateStatus(
      uid,
      status,
      error
    );

    if (!statementImport) {
      throw new NotFoundException(`Statement import with UID ${uid} not found`);
    }

    return statementImport;
  }
}
