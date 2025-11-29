# CLI Commands Guide

This project includes CLI commands built with `nest-commander`.

## Running Commands

Use the `pnpm cli` command followed by the command name:

```bash
pnpm cli <command> [arguments] [options]
```

## Available Commands

### Help

Display available commands:
```bash
pnpm cli --help
```

Get help for a specific command:
```bash
pnpm cli example --help
```

### Example Command

A demonstration command showing arguments and options:

```bash
# Basic usage
pnpm cli example

# With a message argument
pnpm cli example "Hello CLI"

# With options
pnpm cli example "Greetings" --name "Pedro" --count 3
```

Options:
- `-n, --name <name>`: Name to greet
- `-c, --count <count>`: Number of times to repeat

### App Info Command

Display application information (demonstrates dependency injection):

```bash
pnpm cli app-info
```

## Creating New Commands

1. Create a new command file in `src/commands/`:

```typescript
import { Command, CommandRunner, Option } from 'nest-commander';
import { Injectable } from '@nestjs/common';

interface MyCommandOptions {
  verbose?: boolean;
}

@Injectable()
@Command({
  name: 'my-command',
  description: 'Description of my command',
  arguments: '[arg1]',
  argsDescription: {
    arg1: 'Description of arg1',
  },
})
export class MyCommand extends CommandRunner {
  async run(
    passedParams: string[],
    options?: MyCommandOptions,
  ): Promise<void> {
    // Your command logic here
    console.log('Running my command...');
  }

  @Option({
    flags: '-v, --verbose',
    description: 'Verbose output',
  })
  parseVerbose(): boolean {
    return true;
  }
}
```

2. Register the command in `src/commands/command.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { MyCommand } from './my-command';

@Module({
  providers: [MyCommand],
})
export class CommandModule {}
```

3. Run your command:

```bash
pnpm cli my-command
```

## Dependency Injection

Commands support full NestJS dependency injection. You can inject any service:

```typescript
@Injectable()
@Command({ name: 'example' })
export class ExampleCommand extends CommandRunner {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async run(): Promise<void> {
    // Use injected services
    const data = await this.appService.getData();
  }
}
```

Just make sure to add the required services to the `providers` array in [command.module.ts](src/commands/command.module.ts).

## Common Use Cases

- Database seeding
- Running migrations
- Data import/export
- Scheduled tasks
- Administrative operations
- Testing utilities

## Documentation

For more information, see the [nest-commander documentation](https://docs.nestjs.com/recipes/nest-commander).
