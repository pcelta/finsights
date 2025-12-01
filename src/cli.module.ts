import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CommandModule } from './commands/command.module';
import config from './mikro-orm.config';

@Module({
  imports: [MikroOrmModule.forRoot(config), CommandModule],
})
export class CliModule {}
