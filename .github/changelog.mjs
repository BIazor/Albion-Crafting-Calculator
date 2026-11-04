// Posts a changelog entry to the Discord channel that owns DISCORD_WEBHOOK_URL.
// Run by .github/workflows/changelog.yml on every push to main.

import fs from 'node:fs';
import { execSync } from 'node:child_process';

const webhook = process.env.DISCORD_WEBHOOK_URL;
const siteUrl = 'https://albioncrafting.vercel.app';
const siteName = 'Albion Crafting Calculator';

const MAX_ENTRIES = 10;
const MAX_SUBJECT = 140;
const MAX_DESCRIPTION = 3800;

function readEvent() {
  const file = process.env.GITHUB_EVENT_PATH;
  if (!file || !fs.existsSync(file)) return {};
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    console.warn(`Could not read the event payload (${error.message}); falling back to git.`);
    return {};
  }
}

const firstLine = (message) => String(message || '').split('\n')[0].trim();

// Markdown characters would otherwise let a commit subject style the whole embed.
const plain = (text) => text
  .replace(/[`*_~|]/g, '')
  .replace(/\s+/g, ' ')
  .trim();

const clip = (text, max) => (text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`);

function collectFromEvent(event) {
  if (!Array.isArray(event.commits)) return [];
  return event.commits
    .filter((commit) => commit && typeof commit.message === 'string')
    .map((commit) => ({ subject: firstLine(commit.message), sha: String(commit.id || '').slice(0, 7) }))
    .filter((commit) => commit.subject && !/^Merge (branch|pull request|remote-tracking)/i.test(commit.subject));
}

function collectFromGit() {
  // Manual runs have no commit list, so announce the head commit instead.
  try {
    const raw = execSync('git log -1 --pretty=%s%x00%H', { encoding: 'utf8' }).trim();
    const [subject, sha] = raw.split('\u0000');
    if (!subject) return [];
    return [{ subject: firstLine(subject), sha: String(sha || '').slice(0, 7) }];
  } catch (error) {
    console.warn(`Could not read the latest commit (${error.message}).`);
    return [];
  }
}

const event = readEvent();
const entries = (collectFromEvent(event).length ? collectFromEvent(event) : collectFromGit())
  .map((entry) => ({ subject: clip(plain(entry.subject), MAX_SUBJECT), sha: entry.sha }))
  .filter((entry) => entry.subject);

if (!entries.length) {
  console.log('No commits worth announcing; nothing posted.');
  process.exit(0);
}

const shown = entries.slice(0, MAX_ENTRIES);
const hidden = entries.length - shown.length;

const lines = shown.map((entry) => `• ${entry.subject}${entry.sha ? ` (\`${entry.sha}\`)` : ''}`);
if (hidden > 0) lines.push(`…and ${hidden} more commit${hidden === 1 ? '' : 's'}.`);

let description = lines.join('\n');
if (description.length > MAX_DESCRIPTION) {
  description = `${description.slice(0, MAX_DESCRIPTION).trimEnd()}\n…`;
}

const count = entries.length;
const payload = {
  username: `${siteName} changelog`,
  avatar_url: `${siteUrl}/favicon.svg`,
  embeds: [
    {
      title: count === 1 ? '1 new change on main' : `${count} new changes on main`,
      description,
      color: 0x5865f2,
      timestamp: new Date().toISOString(),
      footer: { text: `${siteName} · ${siteUrl.replace(/^https?:\/\//, '')}` },
    },
  ],
  allowed_mentions: { parse: [] },
};

if (!webhook) {
  console.log('DISCORD_WEBHOOK_URL is not set; nothing posted.');
  process.exit(0);
}

let response;
try {
  response = await fetch(webhook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
} catch (error) {
  // A rejected fetch (DNS, offline, blocked port) should fail the run with a readable reason.
  console.error(`Could not reach Discord: ${error.message}`);
  console.error('Check that DISCORD_WEBHOOK_URL is a complete https://discord.com/api/webhooks/... URL.');
  process.exit(1);
}

if (!response.ok) {
  const body = await response.text().catch(() => '');
  console.error(`Discord rejected the post: HTTP ${response.status} ${response.statusText} ${body}`.trim());
  console.error('A 401/403/404 usually means the webhook was deleted, or the URL secret is wrong.');
  process.exit(1);
}

console.log(`Posted ${count} change${count === 1 ? '' : 's'} to Discord.`);
