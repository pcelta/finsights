import { Migration } from '@mikro-orm/migrations';

export class Migration20251217064005 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "financial_institutions" ("id" serial primary key, "uid" varchar(255) not null, "name" varchar(255) not null, "description" text null, "is_enabled" boolean not null default true, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);
    this.addSql(`alter table "financial_institutions" add constraint "financial_institutions_uid_unique" unique ("uid");`);

    this.addSql(`create table "statement_imports" ("id" serial primary key, "uid" varchar(255) not null, "financial_institution_id" int not null, "status" text check ("status" in ('pending', 'processing', 'processed', 'failed')) not null default 'pending', "path" varchar(255) not null, "error" text null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);
    this.addSql(`alter table "statement_imports" add constraint "statement_imports_uid_unique" unique ("uid");`);

    this.addSql(`alter table "statement_imports" add constraint "statement_imports_financial_institution_id_foreign" foreign key ("financial_institution_id") references "financial_institutions" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "statement_imports" drop constraint "statement_imports_financial_institution_id_foreign";`);

    this.addSql(`drop table if exists "financial_institutions" cascade;`);

    this.addSql(`drop table if exists "statement_imports" cascade;`);
  }

}
