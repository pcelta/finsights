import { Migration } from '@mikro-orm/migrations';

export class Migration20251217180200 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      INSERT INTO financial_institutions (uid, name, description, is_enabled, created_at, updated_at)
      VALUES (
        gen_random_uuid()::text,
        'ANZ Bank',
        'Australia and New Zealand Banking Group',
        true,
        NOW(),
        NOW()
      );
    `);
  }

  async down(): Promise<void> {
    this.addSql(`
      DELETE FROM financial_institutions WHERE name = 'ANZ Bank';
    `);
  }
}
