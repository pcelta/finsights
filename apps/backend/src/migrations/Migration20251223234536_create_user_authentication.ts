import { Migration } from '@mikro-orm/migrations';

export class Migration20251223234536_create_user_authentication extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user_accounts" ("id" serial primary key, "uid" varchar(36) not null, "name" varchar(255) not null, "email" varchar(255) not null, "dob" date null, "password" varchar(255) not null, "status" varchar(20) not null, "last_logged_in_at" timestamptz null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);
    this.addSql(`alter table "user_accounts" add constraint "user_accounts_uid_unique" unique ("uid");`);
    this.addSql(`create index "user_accounts_email_index" on "user_accounts" ("email");`);
    this.addSql(`alter table "user_accounts" add constraint "user_accounts_email_unique" unique ("email");`);

    this.addSql(`create table "user_account_activation" ("id" serial primary key, "user_account_id" int not null, "code" varchar(36) not null, "link" text not null, "accessed_at" timestamptz null, "created_at" timestamptz not null, "expires_at" timestamptz not null);`);
    this.addSql(`create index "user_account_activation_code_index" on "user_account_activation" ("code");`);
    this.addSql(`alter table "user_account_activation" add constraint "user_account_activation_code_unique" unique ("code");`);

    this.addSql(`create table "user_account_tokens" ("id" serial primary key, "token" text not null, "user_account_id" int not null, "type" varchar(10) not null, "created_at" timestamptz not null, "expires_at" timestamptz not null);`);

    this.addSql(`alter table "user_account_activation" add constraint "user_account_activation_user_account_id_foreign" foreign key ("user_account_id") references "user_accounts" ("id") on update cascade;`);

    this.addSql(`alter table "user_account_tokens" add constraint "user_account_tokens_user_account_id_foreign" foreign key ("user_account_id") references "user_accounts" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user_account_activation" drop constraint "user_account_activation_user_account_id_foreign";`);

    this.addSql(`alter table "user_account_tokens" drop constraint "user_account_tokens_user_account_id_foreign";`);

    this.addSql(`drop table if exists "user_accounts" cascade;`);

    this.addSql(`drop table if exists "user_account_activation" cascade;`);

    this.addSql(`drop table if exists "user_account_tokens" cascade;`);
  }

}
