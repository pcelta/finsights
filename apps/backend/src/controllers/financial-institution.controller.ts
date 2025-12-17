import { Controller, Get } from '@nestjs/common';
import { FinancialInstitutionService } from '../services/financial-institution.service';

@Controller('api/financial-institutions')
export class FinancialInstitutionController {
  constructor(
    private readonly financialInstitutionService: FinancialInstitutionService,
  ) {}

  @Get()
  async getAll() {
    const institutions = await this.financialInstitutionService.findAll();

    return institutions.map((institution) => ({
      uid: institution.uid,
      name: institution.name,
      description: institution.description,
      isEnabled: institution.isEnabled,
    }));
  }
}
