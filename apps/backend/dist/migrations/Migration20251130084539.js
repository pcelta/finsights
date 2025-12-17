"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20251130084539 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20251130084539 extends migrations_1.Migration {
    async up() {
        this.addSql(`create table "accounts" ("id" serial primary key, "bsb" varchar(6) not null, "number" varchar(20) not null, "bank_name" varchar(100) not null, "description" text null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);
        this.addSql(`create table "transaction_category" ("id" serial primary key, "name" varchar(100) not null, "slug" varchar(100) not null, "description" text null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);
        this.addSql(`alter table "transaction_category" add constraint "transaction_category_slug_unique" unique ("slug");`);
        this.addSql(`create table "transactions" ("id" serial primary key, "description" text not null, "hash" varchar(64) not null, "amount" numeric(12,2) not null, "balance" numeric(12,2) not null, "transaction_date" date not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "account_id" int not null, "category_id" int null);`);
        this.addSql(`create index "transactions_hash_index" on "transactions" ("hash");`);
        this.addSql(`alter table "transactions" add constraint "transactions_hash_unique" unique ("hash");`);
        this.addSql(`alter table "transactions" add constraint "transactions_account_id_foreign" foreign key ("account_id") references "accounts" ("id") on update cascade;`);
        this.addSql(`alter table "transactions" add constraint "transactions_category_id_foreign" foreign key ("category_id") references "transaction_category" ("id") on update cascade on delete set null;`);
    }
}
exports.Migration20251130084539 = Migration20251130084539;
//# sourceMappingURL=Migration20251130084539.js.map