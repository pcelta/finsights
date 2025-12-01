import { Migration } from '@mikro-orm/migrations';

export class Migration20251201010851 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "transaction_categories" add column "rules" jsonb null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "transaction_categories" drop column "rules";`);
  }

}
