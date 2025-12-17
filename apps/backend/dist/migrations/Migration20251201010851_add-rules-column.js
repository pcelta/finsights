"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20251201010851 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20251201010851 extends migrations_1.Migration {
    async up() {
        this.addSql(`alter table "transaction_categories" add column "rules" jsonb null;`);
    }
    async down() {
        this.addSql(`alter table "transaction_categories" drop column "rules";`);
    }
}
exports.Migration20251201010851 = Migration20251201010851;
//# sourceMappingURL=Migration20251201010851_add-rules-column.js.map