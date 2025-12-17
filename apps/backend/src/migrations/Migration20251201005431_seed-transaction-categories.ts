import { Migration } from '@mikro-orm/migrations';

export class Migration20251201005431 extends Migration {

  override async up(): Promise<void> {
    // Seed transaction categories
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

  override async down(): Promise<void> {
    // Remove seeded categories
    this.addSql(`
      DELETE FROM "transaction_categories"
      WHERE "slug" IN ('household', 'groceries', 'going-out', 'car', 'shopping', 'software-apps', 'phone-mobile-internet', 'health', 'round-up');
    `);
  }

}
