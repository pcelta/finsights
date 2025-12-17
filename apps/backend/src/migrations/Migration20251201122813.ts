import { Migration } from '@mikro-orm/migrations';

export class Migration20251201122813 extends Migration {

  override async up(): Promise<void> {
    // Add column as nullable first
    this.addSql(`alter table "transactions" add column "type" varchar(10);`);

    // Set type based on amount: positive = expense, negative = income
    this.addSql(`update "transactions" set "type" = CASE WHEN amount > 0 THEN 'expense' ELSE 'income' END;`);

    // Make column not null
    this.addSql(`alter table "transactions" alter column "type" set not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "transactions" drop column "type";`);
  }

}
