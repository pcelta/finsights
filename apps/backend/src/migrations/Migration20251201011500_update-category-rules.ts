import { Migration } from '@mikro-orm/migrations';

export class Migration20251201011500 extends Migration {

  override async up(): Promise<void> {
    // Update rules for Household category
    this.addSql(`
      UPDATE "transaction_categories"
      SET "rules" = '{"pattern": "(supermarket|coles|woolworths|supabarn|iga|signature property management|deft payments)"}'::jsonb
      WHERE "slug" = 'household';
    `);

    // Update rules for Going out category
    this.addSql(`
      UPDATE "transaction_categories"
      SET "rules" = '{"pattern": "(restaurant|cafe|bar|mcdonald|kfc|hungry jack|subway|domino|pizza|uber eats|deliveroo|menulog|doordash|coffee|the ugly cook|ikea)"}'::jsonb
      WHERE "slug" = 'going-out';
    `);

    // Update rules for Car category
    this.addSql(`
      UPDATE "transaction_categories"
      SET "rules" = '{"pattern": "(petrol|fuel|reddy|shell|caltex|bp|ampol|7-eleven|7 eleven|mobil|parking|rego|registration|insurance|mechanic|car wash|toll|linkt|repco)"}'::jsonb
      WHERE "slug" = 'car';
    `);

    // Update rules for Shopping category
    this.addSql(`
      UPDATE "transaction_categories"
      SET "rules" = '{"pattern": "(kmart|target|big w|myer|david jones|jb hi-fi|harvey norman|officeworks|amazon|ebay|paypal)"}'::jsonb
      WHERE "slug" = 'shopping';
    `);

    // Update rules for Software / Apps category
    this.addSql(`
      UPDATE "transaction_categories"
      SET "rules" = '{"pattern": "(netflix|spotify|adobe|microsoft|github|dropbox|google|apple|app store|play store|subscription|icloud|chatgpt|openai|vpn|claude.ai|anthropic|disney|amazon)"}'::jsonb
      WHERE "slug" = 'software-apps';
    `);

    // Update rules for Phone / Mobile / Internet category
    this.addSql(`
      UPDATE "transaction_categories"
      SET "rules" = '{"pattern": "(telstra|optus|vodafone|telco|mobile|internet|broadband|nbn|data plan|phone bill)"}'::jsonb
      WHERE "slug" = 'phone-mobile-internet';
    `);

    // Update rules for Health category
    this.addSql(`
      UPDATE "transaction_categories"
      SET "rules" = '{"pattern": "(pharmacy|chemist|doctor|medical|health|medicare|hospital|physiotherapy|physio|dental|dentist|medibank|bupa|hcf|optical|gym|fitness|anytime fitness)"}'::jsonb
      WHERE "slug" = 'health';
    `);

    // Update rules for Round Up category
    this.addSql(`
      UPDATE "transaction_categories"
      SET "rules" = '{"pattern": "(round up|roundup)"}'::jsonb
      WHERE "slug" = 'round-up';
    `);
  }

  override async down(): Promise<void> {
    // Remove rules from all categories
    this.addSql(`
      UPDATE "transaction_categories"
      SET "rules" = NULL
      WHERE "slug" IN ('household', 'going-out', 'car', 'shopping', 'software-apps', 'phone-mobile-internet', 'health', 'round-up');
    `);
  }

}
