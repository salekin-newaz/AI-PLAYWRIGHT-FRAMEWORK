/**
 * scripts/gen-tests.js
 *
 * CLI script — generates test spec files for ALL feature instruction files found.
 * Run: node scripts/gen-tests.js
 */

import 'dotenv/config';
import { generateTests } from '../mcp-server/tools/generate-tests.js';
import * as local         from '../mcp-server/adapters/local-adapter.js';

// Map feature slugs to the Page Object classes they use.
// Update this map whenever you add a new feature instruction file.
const FEATURE_PAGES_MAP = {
  'login-flow':     ['LoginPage'],
  'inventory-flow': ['InventoryPage'],
  'cart-flow':      ['CartPage'],
  'checkout-flow':  ['CheckoutPage'],
};

const files = local.listInstructionFiles('features');

if (files.length === 0) {
  console.log('No feature instruction files found in .context/instructions/features/');
  process.exit(0);
}

console.log(`\n🤖 Generating test specs for ${files.length} feature(s)...\n`);

for (const file of files) {
  const featureName = file.name;
  const pagesUsed   = FEATURE_PAGES_MAP[featureName] || [];

  if (pagesUsed.length === 0) {
    console.warn(`  ⚠️  ${featureName}: No pages mapped in FEATURE_PAGES_MAP — skipping`);
    continue;
  }

  console.log(`  ▸ ${featureName} (pages: ${pagesUsed.join(', ')})`);

  try {
    const result = await generateTests({
      feature_name: featureName,
      pages_used:   pagesUsed,
      source:       'local',
    });
    console.log(`    ✅ Done\n`);
  } catch (err) {
    console.error(`    ❌ Failed: ${err.message}\n`);
  }
}

console.log('✅ gen:tests complete\n');
