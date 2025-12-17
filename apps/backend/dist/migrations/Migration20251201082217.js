"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20251201082217 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20251201082217 extends migrations_1.Migration {
    async up() {
        this.addSql(`alter table "accounts" add column "name" varchar(255) null;`);
    }
    async down() {
        this.addSql(`alter table "accounts" drop column "name";`);
    }
}
exports.Migration20251201082217 = Migration20251201082217;
//# sourceMappingURL=Migration20251201082217.js.map