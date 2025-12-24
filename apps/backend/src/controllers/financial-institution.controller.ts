import { Controller, Get, UseGuards } from '@nestjs/common';
import { FinancialInstitutionService } from '../services/financial-institution.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/financial-institutions')
@UseGuards(JwtAuthGuard)
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
