import { Command, CommandRunner, Option } from 'nest-commander';
import { Injectable } from '@nestjs/common';

interface ExampleCommandOptions {
  name?: string;
  count?: number;
}

@Injectable()
@Command({
  name: 'example',
  description: 'An example command',
  arguments: '[message]',
  argsDescription: {
    message: 'Optional message to display',
  },
})
export class ExampleCommand extends CommandRunner {
  async run(
    passedParams: string[],
    options?: ExampleCommandOptions,
  ): Promise<void> {
    const message = passedParams[0] || 'Hello from CLI!';
    const name = options?.name || 'World';
    const count = options?.count || 1;

    console.log(`Running example command...`);
    for (let i = 0; i < count; i++) {
      console.log(`${message} ${name}!`);
    }
  }

  @Option({
    flags: '-n, --name <name>',
    description: 'Name to greet',
  })
  parseName(val: string): string {
    return val;
  }

  @Option({
    flags: '-c, --count <count>',
    description: 'Number of times to repeat',
  })
  parseCount(val: string): number {
    return parseInt(val, 10);
  }
}
