import { Module } from '@nestjs/common';
import { HealthCommand } from './health.command';
import { ParseTransactionsCommand } from './parse-transactions.command';
import { AppService } from '../app.service';
import { ParserModule } from '../parsers/parser.module';

@Module({
  imports: [ParserModule],
  providers: [HealthCommand, ParseTransactionsCommand, AppService],
})
export class CommandModule {}
