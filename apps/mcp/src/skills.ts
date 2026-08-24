import { TOOL_NAMES } from './tools/index';

/**
 * Installable skills.
 *
 * A skill documents the workflow and calls this MCP server. It contains no
 * secret, no token, no platform workaround and no instruction to work around a
 * refusal. If a tool says a person must confirm, the skill says so too and
 * stops. An agent that has been told how to route around a control is worse
 * than one that never had the skill.
 *
 * The body is generated from the real tool list, so a skill can never document
 * a tool that does not exist or omit one that does.
 */

export const SKILL_HOSTS = ['claude-code', 'codex', 'hermes'] as const;
export type SkillHost = (typeof SKILL_HOSTS)[number];

export interface SkillDefinition {
  readonly host: SkillHost;
  readonly name: string;
  readonly description: string;
  /** Relative path inside `skills/` where this file is checked in. */
  readonly path: string;
  readonly body: string;
}

const WORKFLOW = `## The workflow

Always in this order. Skipping a step is how an agent publishes something nobody read.

1. \`list_accounts\` to see which accounts exist and whether they are healthy.
2. \`get_capabilities\` for each account you intend to use. Character limits,
   media rules and cost differ per account, and \`unsupported\` (the platform
   does not offer it) is not the same as \`not_implemented\` (Post Array has not built
   it). Never treat them as the same.
3. \`draft_post\` with one master body and one entry per target account. Use
   Post Array connection ids. A raw platform handle is never accepted.
4. \`validate_post\`. Fix every \`error\` before going further. A \`warning\` is a
   judgement call; explain it to the person rather than silently ignoring it.
5. \`preview_post\` for each target and show the person what will actually
   appear.
6. \`request_approval\` if the workspace requires it, or if you are unsure.
7. \`schedule_post\` with an \`idempotency_key\` you generate once and reuse on
   retry, or \`publish_post\` for immediate publication.
8. \`get_post_status\` to confirm, then \`get_analytics\` later.

## Rules

- **Immediate publication needs a person.** \`publish_post\` called without a
  \`confirmation_id\` returns a confirmation link and publishes nothing. Give the
  person the link, wait, and call it again with the id. Do not tell the person
  it published. Do not retry in a loop hoping it goes through.
- **Idempotency keys are not optional** on \`schedule_post\`, \`publish_post\`,
  \`cancel_post\` and \`create_campaign_from_plan\`. Generate one key per intended
  action and reuse it verbatim on every retry of that same action. A new key on
  a retry is how one post becomes two.
- **A refusal is an answer.** If a tool returns \`SCOPE_INSUFFICIENT\`,
  \`APPROVAL_REQUIRED\` or \`POLICY_BLOCKED\`, report it and stop. Do not look for
  another tool that might do the same thing.
- **A missing metric is not zero.** \`get_analytics\` returns an \`availability\`
  for every metric. If it is not \`available\`, say the metric could not be read
  and why. Never report it as 0.
- **Never invent a URL.** \`list_growth_opportunities\` returns catalog records
  with official URLs and a \`last_verified_at\`. Use those. Do not supply a
  directory or community URL from memory.
- **Cost is real.** \`validate_post\` returns an estimated provider cost. On X, a
  post containing a URL costs materially more. Show the estimate before a bulk
  schedule.
- **Time is explicit.** \`schedule_post\` needs an absolute instant and the IANA
  time zone the person chose. Never a bare local time.

## What this server will not do

There is no tool that publishes everywhere at once, no tool that likes, follows,
replies or sends a message, and no way to bypass the approval policy. If you are
asked for one of those, say it is not available and why.`;

const CONFIGURATION = `## Configuration

The endpoint is the remote Streamable HTTP MCP URL for your Post Array deployment,
and authorization is OAuth against Post Array's own issuer. Your client performs the
OAuth flow; you never paste a token into this file, and this file never contains
one.`;

function toolTable(): string {
  return ['Available tools:', '', ...TOOL_NAMES.map((name) => `- \`${name}\``)].join('\n');
}

function body(host: SkillHost, title: string, intro: string): string {
  return [
    `# ${title}`,
    '',
    intro,
    '',
    CONFIGURATION,
    '',
    `_Host: ${host}._`,
    '',
    toolTable(),
    '',
    WORKFLOW,
    '',
  ].join('\n');
}

const DESCRIPTION =
  'Draft, validate, preview, approve, schedule and publish social posts through Post Array, with receipts and the same approval policy as the app.';

export const SKILLS: readonly SkillDefinition[] = [
  {
    host: 'claude-code',
    name: 'relay-publishing',
    description: DESCRIPTION,
    path: 'claude-code/relay-publishing/SKILL.md',
    body: body(
      'claude-code',
      'Post Array publishing',
      'Use this skill when the user asks to draft, review, schedule or publish a social post, or to look at what is scheduled or how a post performed. It calls the Post Array MCP server, which enforces the same permissions and approval policy as the Post Array app.',
    ),
  },
  {
    host: 'codex',
    name: 'relay-publishing',
    description: DESCRIPTION,
    path: 'codex/relay-publishing.md',
    body: body(
      'codex',
      'Post Array publishing',
      'Add the Post Array MCP server to your Codex configuration as a remote HTTP server with OAuth, then follow this workflow whenever the task involves social publishing.',
    ),
  },
  {
    host: 'hermes',
    name: 'relay-publishing',
    description: DESCRIPTION,
    path: 'hermes/relay-publishing.md',
    body: body(
      'hermes',
      'Post Array publishing',
      'Connect the Post Array MCP server over HTTP, then follow this workflow. Post Array is authoritative for approvals: a Hermes scheduled task cannot pre-approve a publication on the user’s behalf.',
    ),
  },
];

export function skillFor(host: SkillHost): SkillDefinition {
  const skill = SKILLS.find((candidate) => candidate.host === host);
  if (skill === undefined) {
    throw new Error('UNKNOWN_SKILL_HOST');
  }
  return skill;
}
