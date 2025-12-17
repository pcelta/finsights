import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';
import { StatementImportService } from '../services/statement-import.service';

@Controller('api/import')
export class ImportController {
  constructor(
    private readonly statementImportService: StatementImportService,
  ) {}

  @Post('statement')
  @UseInterceptors(FileInterceptor('file'))
  async uploadStatement(
    @UploadedFile() file: Express.Multer.File,
    @Body('financial_institution_uid') financialInstitutionUid: string,
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

  @Get('imports')
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
