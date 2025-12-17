import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { StatementImportRepository } from '../repositories/statement-import.repository';
import { StatementImportStatus } from '../entities/statement-import.entity';
import { TransactionService } from '../services/transaction.service';
import { TransactionParserService } from '../services/transaction-parser.service';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

@Processor('statement-processing')
export class StatementProcessor {
  private readonly logger = new Logger(StatementProcessor.name);

  constructor(
    private readonly statementImportRepository: StatementImportRepository,
    private readonly transactionService: TransactionService,
    private readonly transactionParserService: TransactionParserService,
  ) {}

  @Process()
  async process(job: Job): Promise<void> {
    const { statementImportUid } = job.data;

    this.logger.log(`Processing statement import: ${statementImportUid}`);

    try {
      // Find the statement import
      const statementImport = await this.statementImportRepository.findByUid(
        statementImportUid,
      );

      if (!statementImport) {
        throw new Error(`Statement import ${statementImportUid} not found`);
      }

      // Update status to processing
      await this.statementImportRepository.updateStatus(
        statementImportUid,
        StatementImportStatus.PROCESSING,
      );

      // Read and parse the PDF file
      const pdfBuffer = await readFile(statementImport.path);
      const pdfText = await this.extractTextFromPDF(pdfBuffer);

      // Parse the statement using the appropriate parser based on financial institution
      const financialInstitutionName = statementImport.financialInstitution.name.toUpperCase();

      // Map financial institution name to parser bank type
      let bankType: string;
      if (financialInstitutionName.includes('ANZ')) {
        bankType = 'ANZ';
      } else {
        throw new Error(
          `No parser available for financial institution: ${statementImport.financialInstitution.name}`
        );
      }

      const bankStatement = this.transactionParserService.parseStatement(
        pdfText,
        bankType as any,
      );

      // Ingest transactions
      await this.transactionService.ingest(bankStatement);

      // Mark as processed
      await this.statementImportRepository.updateStatus(
        statementImportUid,
        StatementImportStatus.PROCESSED,
      );

      this.logger.log(`Successfully processed statement import: ${statementImportUid}`);
    } catch (error) {
      this.logger.error(
        `Failed to process statement import: ${statementImportUid}`,
        error instanceof Error ? error.stack : String(error),
      );

      // Mark as failed with error message
      await this.statementImportRepository.updateStatus(
        statementImportUid,
        StatementImportStatus.FAILED,
        error instanceof Error ? error.message : String(error),
      );

      throw error;
    }
  }

  private async extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(pdfBuffer),
      useSystemFonts: true,
    });

    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  }
}
