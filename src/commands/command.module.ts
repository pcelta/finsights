import { Module } from '@nestjs/common';
import { ExampleCommand } from './example.command';
import { HealthCommand } from './health.command';
import { ReadCommand } from './read.command';
import { AppService } from '../app.service';

@Module({
  providers: [
    ExampleCommand,
    HealthCommand,
    ReadCommand,
    AppService,
  ],
})
export class CommandModule {}
