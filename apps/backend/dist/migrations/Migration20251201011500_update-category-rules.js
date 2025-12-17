"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20251201011500 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20251201011500 extends migrations_1.Migration {
    async up() {
        this.addSql(`
      UPDATE "transaction_categories"
      SET "rules" = '{"pattern": "(supermarket|coles|woolworths|supabarn|iga|signature property management|deft payments)"}'::jsonb
      WHERE "slug" = 'household';
    `);
        this.addSql(`
      UPDATE "transaction_categories"
      SET "rules" = '{"pattern": "(restaurant|cafe|bar|mcdonald|kfc|hungry jack|subway|domino|pizza|uber eats|deliveroo|menulog|doordash|coffee|the ugly cook|ikea)"}'::jsonb
      WHERE "slug" = 'going-out';
    `);
        this.addSql(`
      UPDATE "transaction_categories"
      SET "rules" = '{"pattern": "(petrol|fuel|reddy|shell|caltex|bp|ampol|7-eleven|7 eleven|mobil|parking|rego|registration|insurance|mechanic|car wash|toll|linkt|repco)"}'::jsonb
      WHERE "slug" = 'car';
    `);
        this.addSql(`
      UPDATE "transaction_categories"
      SET "rules" = '{"pattern": "(kmart|target|big w|myer|david jones|jb hi-fi|harvey norman|officeworks|amazon|ebay|paypal)"}'::jsonb
      WHERE "slug" = 'shopping';
    `);
        this.addSql(`
      UPDATE "transaction_categories"
      SET "rules" = '{"pattern": "(netflix|spotify|adobe|microsoft|github|dropbox|google|apple|app store|play store|subscription|icloud|chatgpt|openai|vpn|claude.ai|anthropic|disney|amazon)"}'::jsonb
      WHERE "slug" = 'software-apps';
    `);
        this.addSql(`
      UPDATE "transaction_categories"
      SET "rules" = '{"pattern": "(telstra|optus|vodafone|telco|mobile|internet|broadband|nbn|data plan|phone bill)"}'::jsonb
      WHERE "slug" = 'phone-mobile-internet';
    `);
        this.addSql(`
      UPDATE "transaction_categories"
      SET "rules" = '{"pattern": "(pharmacy|chemist|doctor|medical|health|medicare|hospital|physiotherapy|physio|dental|dentist|medibank|bupa|hcf|optical|gym|fitness|anytime fitness)"}'::jsonb
      WHERE "slug" = 'health';
    `);
        this.addSql(`
      UPDATE "transaction_categories"
      SET "rules" = '{"pattern": "(round up|roundup)"}'::jsonb
      WHERE "slug" = 'round-up';
    `);
    }
    async down() {
        this.addSql(`
      UPDATE "transaction_categories"
      SET "rules" = NULL
      WHERE "slug" IN ('household', 'going-out', 'car', 'shopping', 'software-apps', 'phone-mobile-internet', 'health', 'round-up');
    `);
    }
}
exports.Migration20251201011500 = Migration20251201011500;
//# sourceMappingURL=Migration20251201011500_update-category-rules.js.map