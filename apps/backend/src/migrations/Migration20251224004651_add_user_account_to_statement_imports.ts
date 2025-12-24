import { Migration } from '@mikro-orm/migrations';

export class Migration20251224004651_add_user_account_to_statement_imports extends Migration {

  override async up(): Promise<void> {
    // Add column as nullable first
    this.addSql(`alter table "statement_imports" add column "user_account_id" int null;`);

    // Update existing records to link to user_account id 1
    this.addSql(`update "statement_imports" set "user_account_id" = 1 where "user_account_id" is null;`);

    // Make column not null
    this.addSql(`alter table "statement_imports" alter column "user_account_id" set not null;`);

    // Add foreign key constraint
    this.addSql(`alter table "statement_imports" add constraint "statement_imports_user_account_id_foreign" foreign key ("user_account_id") references "user_accounts" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "statement_imports" drop constraint "statement_imports_user_account_id_foreign";`);

    this.addSql(`alter table "statement_imports" drop column "user_account_id";`);
  }

}
