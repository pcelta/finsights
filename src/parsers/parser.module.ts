import { Module } from '@nestjs/common';
import { ANZParser } from './anz.parser';
import { TransactionParserService } from '../services/transaction-parser.service';

@Module({
  providers: [ANZParser, TransactionParserService],
  exports: [TransactionParserService],
})
export class ParserModule {}
