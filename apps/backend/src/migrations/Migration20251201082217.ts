import { Migration } from '@mikro-orm/migrations';

export class Migration20251201082217 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "accounts" add column "name" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "accounts" drop column "name";`);
  }

}
