import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { StatementImportService } from '../services/statement-import.service';
import { User } from '../auth/user.decorator';
import { UserAccount } from '../entities/user-account.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/import')
@UseGuards(JwtAuthGuard)
export class ImportController {
  constructor(
    private readonly statementImportService: StatementImportService,
  ) {}

  @Post('statement')
  @UseInterceptors(FileInterceptor('file'))
  async uploadStatement(
    @UploadedFile() file: Express.Multer.File,
    @Body('financial_institution_uid') financialInstitutionUid: string,
    @User() user: UserAccount,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    if (!financialInstitutionUid) {
      throw new BadRequestException('financial_institution_uid is required');
    }

    const statementImport = await this.statementImportService.create(
      financialInstitutionUid,
      file.path,
      user,
    );

    return {
      uid: statementImport.uid,
      status: statementImport.status,
      financialInstitution: {
        uid: statementImport.financialInstitution.uid,
        name: statementImport.financialInstitution.name,
      },
      createdAt: statementImport.createdAt,
    };
  }

  @Get('statement/:uid')
  async getStatementImport(@Param('uid') uid: string) {
    const statementImport = await this.statementImportService.findByUid(uid);

    return {
      uid: statementImport.uid,
      status: statementImport.status,
      path: statementImport.path,
      error: statementImport.error,
      financialInstitution: {
        uid: statementImport.financialInstitution.uid,
        name: statementImport.financialInstitution.name,
        description: statementImport.financialInstitution.description,
      },
      createdAt: statementImport.createdAt,
      updatedAt: statementImport.updatedAt,
    };
  }

  @Get('/')
  async getAllImports() {
    const imports = await this.statementImportService.findAll();

    return imports.map((statementImport) => ({
      uid: statementImport.uid,
      status: statementImport.status,
      path: statementImport.path,
      error: statementImport.error,
      financialInstitution: {
        uid: statementImport.financialInstitution.uid,
        name: statementImport.financialInstitution.name,
      },
      createdAt: statementImport.createdAt,
      updatedAt: statementImport.updatedAt,
    }));
  }
}
