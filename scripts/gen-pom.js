/**
 * scripts/gen-pom.js
 *
 * CLI script — generates Page Objects for ALL page instruction files found.
 * Run: node scripts/gen-pom.js
 *
 * The MCP server tool does the same for individual pages on demand.
 * This script is for bulk regeneration of all pages at once.
 */

import 'dotenv/config';
import { generatePom } from '../mcp-server/tools/generate-pom.js';
import * as local       from '../mcp-server/adapters/local-adapter.js';

const files = local.listInstructionFiles('pages');

if (files.length === 0) {
  console.log('No page instruction files found in .context/instructions/pages/');
  process.exit(0);
}

console.log(`\n🤖 Generating Page Objects for ${files.length} page(s)...\n`);

for (const file of files) {
  // Convert slug "login-page" → class name "LoginPage"
  const pageName = file.name
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join('')
    .replace('Page', '') + 'Page';

  console.log(`  ▸ ${pageName} (from ${file.path})`);

  try {
    const result = await generatePom({ page_name: pageName, source: 'local' });
    console.log(`    ✅ Done\n`);
  } catch (err) {
    console.error(`    ❌ Failed: ${err.message}\n`);
  }
}

console.log('✅ gen:pom complete\n');
