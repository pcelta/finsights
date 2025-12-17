"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20251201005431 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20251201005431 extends migrations_1.Migration {
    async up() {
        this.addSql(`
      INSERT INTO "transaction_categories" ("name", "slug", "created_at", "updated_at")
      VALUES
        ('Household', 'household', NOW(), NOW()),
        ('Going out', 'going-out', NOW(), NOW()),
        ('Car', 'car', NOW(), NOW()),
        ('Shopping', 'shopping', NOW(), NOW()),
        ('Software / Apps', 'software-apps', NOW(), NOW()),
        ('Phone / Mobile / Internet', 'phone-mobile-internet', NOW(), NOW()),
        ('Health', 'health', NOW(), NOW()),
        ('Round Up', 'round-up', NOW(), NOW());
    `);
    }
    async down() {
        this.addSql(`
      DELETE FROM "transaction_categories"
      WHERE "slug" IN ('household', 'groceries', 'going-out', 'car', 'shopping', 'software-apps', 'phone-mobile-internet', 'health', 'round-up');
    `);
    }
}
exports.Migration20251201005431 = Migration20251201005431;
//# sourceMappingURL=Migration20251201005431_seed-transaction-categories.js.map