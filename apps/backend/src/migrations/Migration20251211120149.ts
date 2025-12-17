import { Migration } from '@mikro-orm/migrations';

export class Migration20251211120149 extends Migration {

  override async up(): Promise<void> {
    // Add uid columns as nullable first
    this.addSql(`alter table "accounts" add column "uid" varchar(36);`);
    this.addSql(`alter table "transaction_categories" add column "uid" varchar(36);`);
    this.addSql(`alter table "transactions" add column "uid" varchar(36);`);

    // Generate UIDs for existing records using gen_random_uuid()
    this.addSql(`update "accounts" set "uid" = gen_random_uuid() where "uid" is null;`);
    this.addSql(`update "transaction_categories" set "uid" = gen_random_uuid() where "uid" is null;`);
    this.addSql(`update "transactions" set "uid" = gen_random_uuid() where "uid" is null;`);

    // Now make the columns not null and add unique constraints
    this.addSql(`alter table "accounts" alter column "uid" set not null;`);
    this.addSql(`alter table "accounts" add constraint "accounts_uid_unique" unique ("uid");`);

    this.addSql(`alter table "transaction_categories" alter column "uid" set not null;`);
    this.addSql(`alter table "transaction_categories" add constraint "transaction_categories_uid_unique" unique ("uid");`);

    this.addSql(`alter table "transactions" alter column "uid" set not null;`);
    this.addSql(`alter table "transactions" add constraint "transactions_uid_unique" unique ("uid");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "accounts" drop constraint "accounts_uid_unique";`);
    this.addSql(`alter table "accounts" drop column "uid";`);

    this.addSql(`alter table "transaction_categories" drop constraint "transaction_categories_uid_unique";`);
    this.addSql(`alter table "transaction_categories" drop column "uid";`);

    this.addSql(`alter table "transactions" drop constraint "transactions_uid_unique";`);
    this.addSql(`alter table "transactions" drop column "uid";`);
  }

}
