import { Module } from '@nestjs/common';
import { HealthCommand } from './health.command';
import { AppService } from '../app.service';
import { ParserModule } from '../parsers/parser.module';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [ParserModule, ServicesModule],
  providers: [HealthCommand, AppService],
})
export class CommandModule {}
