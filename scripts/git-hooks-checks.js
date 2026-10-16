// Git hook checks runner. Called by .husky/pre-commit and .husky/pre-push.
//
// Usage: node scripts/git-hooks-checks.js commit|push
//
// Two sets of checks:
// - commit (fast, runs on every commit): tsc, unit tests if a test script
//   exists
// - push (slow, runs before a push): full Cloudflare worker build +
//   wrangler dry-run, matching what `yarn deploy` runs
//
// Rules from issue #70: the hook runs all the checks; one broken check
// never stops the others. A report file (.pre-commit-report.md) is written
// only when a check fails; a clean run deletes a stale report.
//
// Plain CommonJS, Node >= 22, no dependencies.

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPORT_PATH = path.join(__dirname, '..', '.pre-commit-report.md');
const OUTPUT_TAIL_LINES = 30;

const isWindows = process.platform === 'win32';
// yarn on Windows needs the .cmd shim; npx resolves the right binary itself.
const yarnBin = isWindows ? 'yarn.cmd' : 'yarn';
const npxBin = isWindows ? 'npx.cmd' : 'npx';
const nodeBin = process.execPath;

function runStep(step) {
  return new Promise((resolve) => {
    const bin = step.bin;
    const child = spawn(bin, step.args, {
      cwd: path.join(__dirname, '..'),
      env: process.env,
      shell: isWindows,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });

    const timeout = setTimeout(() => {
      child.kill('SIGKILL');
      timedOut = true;
    }, step.timeoutMs);

    let timedOut = false;

    child.on('error', (error) => {
      clearTimeout(timeout);
      resolve({ ...step, status: 'fail', output: `${String(error)}` });
    });

    child.on('close', (code) => {
      clearTimeout(timeout);
      if (timedOut) {
        resolve({ ...step, status: 'fail', output: `Timed out after ${step.timeoutMs / 1000}s\n${stderr || stdout}` });
        return;
      }
      resolve({ ...step, status: code === 0 ? 'pass' : 'fail', output: `${stdout}${stderr ? `\n${stderr}` : ''}` });
    });
  });
}

function tailOutput(text) {
  if (!text) return '';
  const lines = text.trim().split('\n');
  if (lines.length <= OUTPUT_TAIL_LINES) return text.trim();
  return `... ${lines.length - OUTPUT_TAIL_LINES} earlier lines cut ...\n${lines.slice(-OUTPUT_TAIL_LINES).join('\n')}`;
}

function hasYarnScript(name) {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json')));
  return Boolean(pkg.scripts && pkg.scripts[name]);
}

const COMMIT_STEPS = [
  {
    name: 'tsc',
    description: 'Type check (tsc --noEmit)',
    bin: npxBin,
    args: ['tsc', '--noEmit'],
    timeoutMs: 5 * 60 * 1000,
  },
  {
    name: 'unit-tests',
    description: 'Unit tests (yarn test)',
    skip: () => (hasYarnScript('test') ? null : 'no `test` script in package.json yet'),
    bin: yarnBin,
    args: ['test'],
    timeoutMs: 5 * 60 * 1000,
  },
];

// The push chain mirrors `yarn deploy`: pre-deploy.js writes .env.local
// (gitignored), opennextjs-cloudflare build runs next build + converts the
// worker, wrangler dry-run validates wrangler.jsonc + the bundle without
// deploying. The sitemap regeneration from `yarn build` is skipped on
// purpose: it rewrites the tracked public/sitemap.xml and would leave the
// worktree dirty after a push.
const PUSH_STEPS = [
  {
    name: 'env',
    description: 'Release env file (pre-deploy.js)',
    bin: nodeBin,
    args: ['pre-deploy.js'],
    timeoutMs: 30 * 1000,
  },
  {
    name: 'cf-build',
    description: 'Cloudflare worker build (opennextjs-cloudflare build)',
    bin: yarnBin,
    args: ['opennextjs-cloudflare', 'build'],
    timeoutMs: 20 * 60 * 1000,
  },
  {
    name: 'wrangler-dry-run',
    description: 'Wrangler validation (deploy --dry-run)',
    bin: yarnBin,
    args: ['wrangler', 'deploy', '--dry-run'],
    timeoutMs: 5 * 60 * 1000,
  },
];

async function main() {
  const set = process.argv[2];
  if (set !== 'commit' && set !== 'push') {
    console.error('Usage: node scripts/git-hooks-checks.js commit|push');
    process.exit(2);
  }

  const steps = set === 'commit' ? COMMIT_STEPS : PUSH_STEPS;

  const prepared = steps.map((step) => {
    const skipReason = step.skip ? step.skip() : null;
    return { ...step, resolvedStatus: skipReason ? 'skip' : null, skipReason };
  });

  // Resolve skipped steps up front, run the rest. One broken check never
  // stops the others.
  const skipped = prepared.filter((step) => step.resolvedStatus === 'skip');
  const active = prepared.filter((step) => step.resolvedStatus !== 'skip');

  const isCommitSet = set === 'commit';
  const results = [];

  if (isCommitSet) {
    // Fast checks, safe side by side.
    console.log(`Pre-commit checks: ${active.map((s) => s.name).join(', ')}${skipped.length ? ` (skipped: ${skipped.map((s) => s.name).join(', ')})` : ''}`);
    const parallel = await Promise.all(active.map((step) => runStep(step)));
    results.push(...parallel);
  } else {
    // Push chain: steps depend on each other, run in order but collect
    // every result before deciding.
    console.log(`Pre-push checks: ${active.map((s) => s.name).join(', ')}`);
    for (const step of active) {
      console.log(`\n> ${step.description}`);
      const result = await runStep(step);
      results.push(result);
    }
  }

  const allResults = [...skipped.map((s) => ({ ...s, status: 'skip' })), ...results];
  const failed = allResults.filter((r) => r.status === 'fail');

  // Report file: written only when something failed; a clean run removes a
  // stale report so the file never lies about the last check.
  if (failed.length > 0) {
    const lines = [
      '# Git hook checks report',
      '',
      `Set: ${set} | Date: ${new Date().toISOString()}`,
      '',
      '| Check | Result |',
      '|-------|--------|',
      ...allResults.map((r) => `| ${r.description} | ${r.status === 'pass' ? 'pass' : r.status === 'skip' ? `skipped (${r.skipReason})` : 'FAIL'} |`),
      '',
      ...allResults
        .filter((r) => r.status === 'fail')
        .flatMap((r) => [`## ${r.description}`, '', '```', tailOutput(r.output), '```', '']),
    ];
    fs.writeFileSync(REPORT_PATH, `${lines.join('\n')}\n`);
    console.error(`\n${failed.length} check(s) failed. Report: .pre-commit-report.md`);
  } else if (fs.existsSync(REPORT_PATH)) {
    fs.unlinkSync(REPORT_PATH);
  }

  for (const r of allResults) {
    if (r.status === 'skip') console.log(`- ${r.name}: skipped (${r.skipReason})`);
    else console.log(`- ${r.name}: ${r.status === 'pass' ? 'pass' : 'FAIL'}`);
  }

  process.exit(failed.length > 0 ? 1 : 0);
}

main();
