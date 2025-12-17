"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20251201122813 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20251201122813 extends migrations_1.Migration {
    async up() {
        this.addSql(`alter table "transactions" add column "type" varchar(10);`);
        this.addSql(`update "transactions" set "type" = CASE WHEN amount > 0 THEN 'expense' ELSE 'income' END;`);
        this.addSql(`alter table "transactions" alter column "type" set not null;`);
    }
    async down() {
        this.addSql(`alter table "transactions" drop column "type";`);
    }
}
exports.Migration20251201122813 = Migration20251201122813;
//# sourceMappingURL=Migration20251201122813.js.map