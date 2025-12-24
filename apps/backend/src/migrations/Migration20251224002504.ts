import { Migration } from '@mikro-orm/migrations';

export class Migration20251224002504 extends Migration {

  override async up(): Promise<void> {
    // Add columns as nullable first
    this.addSql(`alter table "transaction_categories" add column "user_account_id" int null;`);
    this.addSql(`alter table "accounts" add column "user_account_id" int null;`);

    // Update existing records to link to user_account id 1
    this.addSql(`update "transaction_categories" set "user_account_id" = 1 where "user_account_id" is null;`);
    this.addSql(`update "accounts" set "user_account_id" = 1 where "user_account_id" is null;`);

    // Make columns not null
    this.addSql(`alter table "transaction_categories" alter column "user_account_id" set not null;`);
    this.addSql(`alter table "accounts" alter column "user_account_id" set not null;`);

    // Add foreign key constraints
    this.addSql(`alter table "transaction_categories" add constraint "transaction_categories_user_account_id_foreign" foreign key ("user_account_id") references "user_accounts" ("id") on update cascade;`);
    this.addSql(`alter table "accounts" add constraint "accounts_user_account_id_foreign" foreign key ("user_account_id") references "user_accounts" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "accounts" drop constraint "accounts_user_account_id_foreign";`);

    this.addSql(`alter table "transaction_categories" drop constraint "transaction_categories_user_account_id_foreign";`);

    this.addSql(`alter table "accounts" drop column "user_account_id";`);

    this.addSql(`alter table "transaction_categories" drop column "user_account_id";`);
  }

}
