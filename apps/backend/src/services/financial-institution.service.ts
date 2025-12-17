import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { FinancialInstitution } from '../entities/financial-institution.entity';
import { FinancialInstitutionRepository } from '../repositories/financial-institution.repository';

@Injectable()
export class FinancialInstitutionService {
  constructor(
    private readonly financialInstitutionRepository: FinancialInstitutionRepository,
  ) {}

  async create(
    name: string,
    description?: string,
    isEnabled: boolean = true
  ): Promise<FinancialInstitution> {
    if (!name || name.trim().length === 0) {
      throw new BadRequestException('Name is required');
    }

    const institution = new FinancialInstitution();
    institution.name = name.trim();
    institution.description = description?.trim();
    institution.isEnabled = isEnabled;

    return this.financialInstitutionRepository.save(institution);
  }

  async findByUid(uid: string): Promise<FinancialInstitution> {
    const institution = await this.financialInstitutionRepository.findByUid(uid);
    if (!institution) {
      throw new NotFoundException(`Financial institution with UID ${uid} not found`);
    }
    return institution;
  }

  async findAll(): Promise<FinancialInstitution[]> {
    return this.financialInstitutionRepository.findAll();
  }

  async findEnabled(): Promise<FinancialInstitution[]> {
    return this.financialInstitutionRepository.findEnabled();
  }
}
