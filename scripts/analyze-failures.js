/**
 * scripts/analyze-failures.js
 * Run: node scripts/analyze-failures.js
 */

import 'dotenv/config';
import { analyzeFailures } from '../mcp-server/tools/analyze-failures.js';

console.log('\n🔍 Analysing test failures...\n');

try {
  const result = await analyzeFailures({ output_format: 'text' });
  console.log(result);
} catch (err) {
  console.error('❌ Analysis failed:', err.message);
  process.exit(1);
}
