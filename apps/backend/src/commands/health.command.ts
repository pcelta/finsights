import { Command, CommandRunner } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { AppService } from '../app.service';

@Injectable()
@Command({
  name: 'fin:health',
  description: 'Display app information (demonstrates dependency injection)',
})
export class HealthCommand extends CommandRunner {
  constructor(private readonly appService: AppService) {
    super();
  }

  async run(): Promise<void> {
    console.log('=== App Information ===');
    console.log(`Message: ${this.appService.getHello()}`);
    console.log(`Version: 0.0.1`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  }
}
