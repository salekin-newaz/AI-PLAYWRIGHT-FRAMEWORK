import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Config ────────────────────────────────────────────────────────────────────
const REPORT_PATH   = path.join(__dirname, '../reports/last-run.json');
const JIRA_BASE_URL = process.env.JIRA_BASE_URL || 'https://md-salekin-newaz.atlassian.net';
const JIRA_EMAIL    = process.env.JIRA_EMAIL;
const JIRA_TOKEN    = process.env.JIRA_API_TOKEN;
const JIRA_PROJECT  = process.env.JIRA_PROJECT_KEY || 'TP';
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

// ── Priority rules ────────────────────────────────────────────────────────────
const PRIORITY_RULES = [
  {
    keywords: ['login', 'auth', 'checkout', 'payment', 'order', 'finish', 'complete'],
    priority: 'P1', jira: 'Highest', label: 'Critical',
  },
  {
    keywords: ['cart', 'add to cart', 'navigation', 'form', 'submit', 'continue', 'redirect'],
    priority: 'P2', jira: 'High', label: 'High',
  },
  {
    keywords: ['sort', 'filter', 'display', 'label', 'text', 'ui', 'badge', 'dismiss'],
    priority: 'P3', jira: 'Medium', label: 'Medium',
  },
];

// ── Extract failures from Playwright JSON report ──────────────────────────────
function extractFailures(report) {
  const failures = [];

  function walk(suites, file = '') {
    for (const suite of suites || []) {
      const currentFile = suite.file || file;
      for (const spec of suite.specs || []) {
        for (const test of spec.tests || []) {
          const lastResult = test.results?.[test.results.length - 1];
          const failed = test.status === 'unexpected' ||
                         lastResult?.status === 'failed' ||
                         lastResult?.status === 'timedOut';
          if (failed) {
            const result = lastResult;
            failures.push({
              file:      currentFile,
              suite:     suite.title,
              title:     spec.title,
              fullTitle: `${suite.title} › ${spec.title}`,
              status:    test.status,
              error:     result?.error?.message || 'Unknown error',
              stack:     result?.error?.stack   || '',
              duration:  result?.duration       || 0,
            });
          }
        }
      }
      if (suite.suites) walk(suite.suites, currentFile);
    }
  }

  walk(report.suites);
  return failures;
}

// ── Determine priority from test name + error content ────────────────────────
function determinePriority(failure) {
  const text = `${failure.fullTitle} ${failure.error}`.toLowerCase();
  for (const rule of PRIORITY_RULES) {
    if (rule.keywords.some(k => text.includes(k))) return rule;
  }
  return { priority: 'P3', jira: 'Medium', label: 'Medium' };
}

// ── Rule-based root cause (fallback when no Anthropic key) ───────────────────
function analyzeRuleBased(failure) {
  const err = failure.error.toLowerCase();

  if (err.includes('timeout') || err.includes('timed out')) {
    return {
      category:     'timing',
      errorSummary: 'Test timed out waiting for an element or action.',
      rootCause:    'The action exceeded the configured timeout. The element may not be visible, the page may be loading slowly, or the selector may have changed.',
      suggestedFix: 'Run in headed mode to observe the failure. Check if the selector is still valid and the page responds within 10 s.',
    };
  }
  if (err.includes('tobevisible') || err.includes('not visible') || err.includes('element(s) not found')) {
    return {
      category:     'selector',
      errorSummary: 'Expected element was not visible on the page.',
      rootCause:    'The locator did not match any visible element. The selector may have changed, the element may not have rendered, or a preceding navigation failed.',
      suggestedFix: 'Verify the selector in the Page Object against the live DOM. Check that the previous step navigated to the correct page.',
    };
  }
  if (err.includes('tohaveurl') || err.includes('navigation') || err.includes('url')) {
    return {
      category:     'navigation',
      errorSummary: 'Page did not navigate to the expected URL.',
      rootCause:    'The expected redirect did not occur. The preceding action (button click, form submit) may have failed silently or the app returned an error.',
      suggestedFix: 'Check that the triggering action completed. Look for a network error or validation message that prevented navigation.',
    };
  }
  if (err.includes('tohavetext') || err.includes('tocontaintext')) {
    return {
      category:     'assertion',
      errorSummary: 'Element text did not match the expected value.',
      rootCause:    'The element was found but its text content differed from the assertion. The application copy may have changed or the wrong element was targeted.',
      suggestedFix: 'Compare the expected string in the test against the live application. Update the assertion or instruction file if the text has legitimately changed.',
    };
  }
  if (err.includes('strict mode') || err.includes('multiple elements')) {
    return {
      category:     'selector',
      errorSummary: 'Selector matched multiple elements unexpectedly.',
      rootCause:    'The locator is too broad and matches more than one element in the current page state.',
      suggestedFix: 'Narrow the selector using a specific data-test attribute or scope it within a parent container.',
    };
  }

  return {
    category:     'unknown',
    errorSummary: 'Test failed with an unexpected error.',
    rootCause:    `The test failed with: "${failure.error.slice(0, 200)}". Review the stack trace for detail.`,
    suggestedFix: 'Run the test in headed mode (npm run test:headed) to observe the failure visually and identify the root cause.',
  };
}

// ── Claude-enhanced analysis (used when ANTHROPIC_API_KEY is set) ─────────────
async function analyzeWithClaude(failure) {
  const hasKey = ANTHROPIC_KEY && ANTHROPIC_KEY !== 'sk-ant-YOUR_KEY_HERE';
  if (!hasKey) return analyzeRuleBased(failure);

  try {
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const client  = new Anthropic({ apiKey: ANTHROPIC_KEY });
    const prompt  = fs.readFileSync(path.join(__dirname, '../.context/prompts/failure-analyzer.md'), 'utf-8');
    const payload = JSON.stringify({
      test:   failure.fullTitle,
      file:   failure.file,
      status: failure.status,
      error:  failure.error,
      stack:  failure.stack.split('\n').slice(0, 10).join('\n'),
    }, null, 2);

    const msg = await client.messages.create({
      model:      'claude-sonnet-4-6',
      max_tokens: 1024,
      system:     prompt,
      messages:   [{ role: 'user', content: `<FAILURE_REPORT>${payload}</FAILURE_REPORT>` }],
    });

    const text   = msg.content[0].text.trim();
    const parsed = JSON.parse(text.startsWith('[') ? text : `[${text}]`);
    const item   = parsed[0];
    return {
      category:     item.category,
      errorSummary: item.error_summary,
      rootCause:    item.root_cause,
      suggestedFix: item.suggested_fix,
    };
  } catch {
    return analyzeRuleBased(failure);
  }
}

// ── Build Atlassian Document Format (ADF) description ────────────────────────
function buildADF(failure, analysis, priority) {
  const text    = t  => ({ type: 'text', text: t });
  const bold    = t  => ({ type: 'text', text: t, marks: [{ type: 'strong' }] });
  const para    = (...nodes) => ({ type: 'paragraph', content: nodes });
  const heading = (level, t) => ({ type: 'heading', attrs: { level }, content: [text(t)] });
  const code    = t  => ({ type: 'codeBlock', attrs: { language: 'text' }, content: [text(t)] });
  const rule    = () => ({ type: 'rule' });

  return {
    type: 'doc', version: 1,
    content: [
      heading(2, '🔴 Failed Test'),
      para(bold('Suite: '),   text(failure.suite)),
      para(bold('Test: '),    text(failure.title)),
      para(bold('File: '),    text(failure.file)),
      para(bold('Status: '),  text(failure.status.toUpperCase())),
      para(bold('Duration: '), text(`${(failure.duration / 1000).toFixed(1)}s`)),
      rule(),

      heading(2, '❌ Error'),
      code(failure.error),
      rule(),

      heading(2, '🔍 Root Cause'),
      para(text(analysis.rootCause)),
      rule(),

      heading(2, '🛠 Suggested Fix'),
      para(text(analysis.suggestedFix)),
      rule(),

      heading(2, '📊 Priority Justification'),
      para(bold(`${priority.priority} — ${priority.label}: `), text('Matched keywords in test name or error output.')),
      rule(),

      heading(2, '🏷 Category'),
      para(text(analysis.category)),
      rule(),

      heading(2, '📋 Stack Trace'),
      code(failure.stack.split('\n').slice(0, 15).join('\n')),
    ],
  };
}

// ── Create Jira bug ticket ────────────────────────────────────────────────────
async function createJiraTicket(failure, analysis, priority) {
  const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_TOKEN}`).toString('base64');

  const body = JSON.stringify({
    fields: {
      project:     { key: JIRA_PROJECT },
      summary:     `[Bug] ${failure.suite} › ${failure.title}`,
      issuetype:   { name: 'Task' },
      priority:    { name: priority.jira },
      description: buildADF(failure, analysis, priority),
      labels:      ['automated-bug', 'playwright', 'e2e', priority.priority.toLowerCase()],
    },
  });

  const res  = await fetch(`${JIRA_BASE_URL}/rest/api/3/issue`, {
    method:  'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type':  'application/json',
      'Accept':        'application/json',
    },
    body,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data.errors || data.errorMessages));
  return data.key;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(REPORT_PATH)) {
    console.log('⚠️  No test report found at reports/last-run.json. Run npm test first.');
    process.exit(0);
  }
  if (!JIRA_EMAIL || !JIRA_TOKEN) {
    console.error('❌ JIRA_EMAIL and JIRA_API_TOKEN must be set in .env');
    process.exit(1);
  }

  const report   = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf-8'));
  const failures = extractFailures(report);

  if (failures.length === 0) {
    console.log('\n✅ All tests passed — no Jira bugs to create.\n');
    return;
  }

  const usingClaude = ANTHROPIC_KEY && ANTHROPIC_KEY !== 'sk-ant-YOUR_KEY_HERE';
  console.log(`\n🔍 Analysing ${failures.length} failure(s) ${usingClaude ? 'with Claude AI' : '(rule-based)'}...\n`);

  const created = [];

  for (const failure of failures) {
    process.stdout.write(`  ▸ ${failure.fullTitle} ... `);
    try {
      const analysis = await analyzeWithClaude(failure);
      const priority = determinePriority(failure);
      const key      = await createJiraTicket(failure, analysis, priority);
      created.push({ key, title: failure.fullTitle, priority: priority.priority });
      console.log(`✅  ${key}  [${priority.priority} — ${priority.label}]`);
    } catch (err) {
      console.log(`❌  Failed — ${err.message}`);
    }
  }

  console.log(`\n📋 Summary — ${created.length} Jira ticket(s) created:`);
  for (const t of created) {
    console.log(`   ${t.key}  [${t.priority}]  ${t.title}`);
  }
  console.log(`\n🔗 Board: ${JIRA_BASE_URL}/jira/core/projects/${JIRA_PROJECT}/board\n`);
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
