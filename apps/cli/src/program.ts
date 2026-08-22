import { Command, CommanderError, Option } from 'commander';

import { RelayError } from '@relay/contracts';

import { assertNoTokenInArgv } from './config/credentials';
import { createContext } from './context';
import type { CliContext, CliDeps, GlobalOptions } from './context';
import { EXIT_OK, EXIT_USAGE, exitCodeFor } from './exit-codes';
import { processWriter, renderFailure } from './output';
import type { RenderInput, Writer } from './output';

import { authLogin, authLogout, authWhoAmI } from './commands/auth';
import type { LoginFlow } from './commands/auth';
import { configGet, configSet, configUnset } from './commands/config';
import { linksCreate, linksStats } from './commands/links';
import { mediaGet, mediaImport, mediaList, mediaUpload } from './commands/media';
import {
  postsCancel,
  postsPreview,
  postsPublish,
  postsSchedule,
  postsValidate,
} from './commands/posts';
import {
  accountsCapabilities,
  accountsList,
  analyticsAccount,
  analyticsPost,
  calendarList,
  growthPlanExport,
  growthPlanGet,
  postsList,
  postsStatus,
  receiptsGet,
  rulesList,
  rulesTest,
} from './commands/read';

/**
 * The command surface.
 *
 * Commander only parses. Every command body lives in `commands/` and takes an
 * explicit context, so a command can be tested by calling a function rather
 * than by spawning a process.
 *
 * `--json` is available on every command and its envelope shape is a contract.
 */

export const VERSION = '0.1.0';

interface CommandRunInput {
  readonly name: string;
  readonly run: (context: CliContext, render: RenderInput) => Promise<void>;
}

interface ProgramState {
  exitCode: number;
  json: boolean;
  writer: Writer;
}

function globalsFrom(command: Command): GlobalOptions {
  const options = command.optsWithGlobals<{
    json?: boolean;
    profile?: string;
    apiUrl?: string;
    workspaceId?: string;
    dryRun?: boolean;
    yes?: boolean;
  }>();
  return {
    json: options.json === true,
    profile: options.profile,
    apiUrl: options.apiUrl,
    workspaceId: options.workspaceId,
    dryRun: options.dryRun === true,
    yes: options.yes === true,
  };
}

export function buildProgram(deps: CliDeps, state: ProgramState): Command {
  const program = new Command();

  program
    .name('relay')
    .description('Relay publishing control plane')
    .version(VERSION, '-V, --version')
    .configureOutput({
      writeOut: (text) => state.writer.out(text.replace(/\n$/, '')),
      writeErr: (text) => state.writer.err(text.replace(/\n$/, '')),
    })
    .exitOverride()
    .option('--json', 'stable machine readable output', false)
    .option('--profile <name>', 'configuration profile')
    .option('--api-url <url>', 'API base URL')
    .option('--workspace-id <id>', 'workspace to act in')
    .option('--dry-run', 'show the external actions instead of performing them', false)
    .option('--yes', 'skip interactive confirmation where one is offered', false);

  const attach = (command: Command, input: CommandRunInput): Command =>
    command.action(async () => {
      const options = globalsFrom(command);
      state.json = options.json;
      const render: RenderInput = {
        command: input.name,
        json: options.json,
        writer: state.writer,
      };
      const context = await createContext(options, { ...deps, writer: state.writer });
      await input.run(context, render);
    });

  // ---------------------------------------------------------------- auth ----
  const auth = program.command('auth').description('authentication');

  const loginCommand = auth
    .command('login')
    .description('obtain a scoped grant. Risk: read. No token is ever printed')
    .addOption(
      new Option('--flow <flow>', 'authorization flow')
        .choices(['device', 'authorization-code'])
        .default('device'),
    )
    .option('--scope <scope...>', 'scopes to request')
    .option('--workspace <id>', 'workspace to bind the grant to');
  attach(loginCommand, {
    name: 'auth login',
    run: async (context, render) => {
      const options = loginCommand.opts<{
        flow: LoginFlow;
        scope?: string[];
        workspace?: string;
      }>();
      await authLogin(context, render, {
        flow: options.flow,
        scopes: options.scope ?? [],
        workspaceId: options.workspace,
      });
    },
  });

  attach(auth.command('logout').description('revoke the grant and forget it locally'), {
    name: 'auth logout',
    run: authLogout,
  });

  attach(auth.command('whoami').description('subject, workspace, scopes and approval level'), {
    name: 'auth whoami',
    run: authWhoAmI,
  });

  // ------------------------------------------------------------ accounts ----
  const accounts = program.command('accounts').description('connected accounts');

  const accountsListCommand = accounts
    .command('list')
    .description('connected accounts and their health. Risk: read')
    .option('--provider <provider>')
    .option('--project-id <id>')
    .option('--cursor <cursor>')
    .option('--limit <n>', 'page size', (value) => Number.parseInt(value, 10));
  attach(accountsListCommand, {
    name: 'accounts list',
    run: async (context, render) => {
      const options = accountsListCommand.opts<{
        provider?: string;
        projectId?: string;
        cursor?: string;
        limit?: number;
      }>();
      await accountsList(context, render, options);
    },
  });

  const capabilitiesCommand = accounts
    .command('capabilities <connection-id>')
    .description('what this account may do right now. Risk: read');
  attach(capabilitiesCommand, {
    name: 'accounts capabilities',
    run: async (context, render) => {
      const [connectionId] = capabilitiesCommand.args;
      await accountsCapabilities(context, render, connectionId ?? '');
    },
  });

  // --------------------------------------------------------------- posts ----
  const posts = program.command('posts').description('drafts, schedules and publications');

  const validateCommand = posts
    .command('validate [file]')
    .description(
      'deterministic preflight against live platform limits. Risk: read with --content-item. With a file it first creates the draft, which publishes nothing but does need --idempotency-key and drafts:write',
    )
    .option('--content-item <id>', 'validate an existing draft instead of a file')
    .option('--project-id <id>')
    .option('--idempotency-key <key>');
  attach(validateCommand, {
    name: 'posts validate',
    run: async (context, render) => {
      const [file] = validateCommand.args;
      const options = validateCommand.opts<{
        contentItem?: string;
        projectId?: string;
        idempotencyKey?: string;
      }>();
      await postsValidate(context, render, {
        file,
        contentItemId: options.contentItem,
        projectId: options.projectId,
        idempotencyKey: options.idempotencyKey,
      });
    },
  });

  const previewCommand = posts
    .command('preview')
    .description('exact platform variant preview. Risk: read')
    .requiredOption('--content-item <id>')
    .requiredOption('--target <id>', 'connection id of the target');
  attach(previewCommand, {
    name: 'posts preview',
    run: async (context, render) => {
      const options = previewCommand.opts<{ contentItem: string; target: string }>();
      await postsPreview(context, render, {
        contentItemId: options.contentItem,
        targetId: options.target,
      });
    },
  });

  const scheduleCommand = posts
    .command('schedule <file>')
    .description(
      'create a draft and schedule it. Risk: consequential. Requires --idempotency-key and posts:schedule',
    )
    .option('--idempotency-key <key>')
    .option('--project-id <id>');
  attach(scheduleCommand, {
    name: 'posts schedule',
    run: async (context, render) => {
      const [file] = scheduleCommand.args;
      const options = scheduleCommand.opts<{ idempotencyKey?: string; projectId?: string }>();
      await postsSchedule(context, render, file ?? '', options);
    },
  });

  const publishCommand = posts
    .command('publish')
    .description(
      'publish immediately. Risk: consequential. Requires --confirm, --idempotency-key and posts:publish',
    )
    .option('--content-item <id>')
    .option('--file <path>')
    .option('--project-id <id>')
    .option('--idempotency-key <key>')
    .option('--confirm', 'explicit human confirmation for immediate publication', false);
  attach(publishCommand, {
    name: 'posts publish',
    run: async (context, render) => {
      const options = publishCommand.opts<{
        contentItem?: string;
        file?: string;
        projectId?: string;
        idempotencyKey?: string;
        confirm?: boolean;
      }>();
      await postsPublish(context, render, {
        contentItemId: options.contentItem,
        file: options.file,
        projectId: options.projectId,
        idempotencyKey: options.idempotencyKey,
        confirm: options.confirm === true,
      });
    },
  });

  const statusCommand = posts
    .command('status <job-id>')
    .description('publish job state, attempts and receipt. Risk: read');
  attach(statusCommand, {
    name: 'posts status',
    run: async (context, render) => {
      const [jobId] = statusCommand.args;
      await postsStatus(context, render, jobId ?? '');
    },
  });

  const cancelCommand = posts
    .command('cancel <job-id>')
    .description('cancel a scheduled job. Risk: consequential. Requires posts:cancel')
    .option('--reason <reason>')
    .option('--idempotency-key <key>');
  attach(cancelCommand, {
    name: 'posts cancel',
    run: async (context, render) => {
      const [jobId] = cancelCommand.args;
      const options = cancelCommand.opts<{ reason?: string; idempotencyKey?: string }>();
      await postsCancel(context, render, jobId ?? '', options);
    },
  });

  const postsListCommand = posts
    .command('list')
    .description('content items in this workspace. Risk: read')
    .option('--state <state>')
    .option('--project-id <id>')
    .option('--cursor <cursor>')
    .option('--limit <n>', 'page size', (value) => Number.parseInt(value, 10));
  attach(postsListCommand, {
    name: 'posts list',
    run: async (context, render) => {
      const options = postsListCommand.opts<{
        state?: string;
        projectId?: string;
        cursor?: string;
        limit?: number;
      }>();
      await postsList(context, render, options);
    },
  });

  // --------------------------------------------------------------- media ----
  const media = program
    .command('media')
    .description('the media library. Nothing here generates media');

  const mediaListCommand = media
    .command('list')
    .description('assets in this workspace. Risk: read')
    .option('--project-id <id>')
    .option('--kind <kind>', 'image, video, gif, document or audio')
    .option('--cursor <cursor>')
    .option('--limit <n>', 'page size', (value) => Number.parseInt(value, 10));
  attach(mediaListCommand, {
    name: 'media list',
    run: async (context, render) => {
      const options = mediaListCommand.opts<{
        projectId?: string;
        kind?: string;
        cursor?: string;
        limit?: number;
      }>();
      await mediaList(context, render, options);
    },
  });

  const mediaGetCommand = media
    .command('get <media-id>')
    .description('one asset, its scan state and its retention date. Risk: read');
  attach(mediaGetCommand, {
    name: 'media get',
    run: async (context, render) => {
      const [mediaId] = mediaGetCommand.args;
      await mediaGet(context, render, mediaId ?? '');
    },
  });

  const mediaUploadCommand = media
    .command('upload <file>')
    .description(
      'upload a local file and hand it to processing. Risk: reversible. Requires --idempotency-key and media:write',
    )
    .option('--project-id <id>')
    .option('--idempotency-key <key>');
  attach(mediaUploadCommand, {
    name: 'media upload',
    run: async (context, render) => {
      const [file] = mediaUploadCommand.args;
      const options = mediaUploadCommand.opts<{ projectId?: string; idempotencyKey?: string }>();
      await mediaUpload(context, render, file ?? '', options);
    },
  });

  const mediaImportCommand = media
    .command('import <url>')
    .description(
      'import a finished file by URL. Risk: reversible. Requires --idempotency-key and media:write',
    )
    .option('--project-id <id>')
    .option('--idempotency-key <key>');
  attach(mediaImportCommand, {
    name: 'media import',
    run: async (context, render) => {
      const [url] = mediaImportCommand.args;
      const options = mediaImportCommand.opts<{ projectId?: string; idempotencyKey?: string }>();
      await mediaImport(context, render, url ?? '', options);
    },
  });

  // ------------------------------------------------------------ calendar ----
  const calendar = program.command('calendar').description('scheduled work');
  const calendarListCommand = calendar
    .command('list')
    .description('scheduled entries in a window. Risk: read')
    .requiredOption('--from <instant>')
    .requiredOption('--to <instant>')
    .option('--project-id <id>')
    .option('--cursor <cursor>')
    .option('--limit <n>', 'page size', (value) => Number.parseInt(value, 10));
  attach(calendarListCommand, {
    name: 'calendar list',
    run: async (context, render) => {
      const options = calendarListCommand.opts<{
        from: string;
        to: string;
        projectId?: string;
        cursor?: string;
        limit?: number;
      }>();
      await calendarList(context, render, options);
    },
  });

  // ------------------------------------------------------------ receipts ----
  const receipts = program.command('receipts').description('publication receipts');
  const receiptsGetCommand = receipts
    .command('get <receipt-id>')
    .description('immutable evidence of one publication. Risk: read');
  attach(receiptsGetCommand, {
    name: 'receipts get',
    run: async (context, render) => {
      const [receiptId] = receiptsGetCommand.args;
      await receiptsGet(context, render, receiptId ?? '');
    },
  });

  // ----------------------------------------------------------- analytics ----
  const analytics = program.command('analytics').description('metrics with their definitions');

  const analyticsPostCommand = analytics
    .command('post <receipt-id>')
    .description('post metrics. Unavailable metrics are labelled, never zero. Risk: read');
  attach(analyticsPostCommand, {
    name: 'analytics post',
    run: async (context, render) => {
      const [receiptId] = analyticsPostCommand.args;
      await analyticsPost(context, render, receiptId ?? '');
    },
  });

  const analyticsAccountCommand = analytics
    .command('account <connection-id>')
    .description('account metrics. Risk: read')
    .option('--from <instant>')
    .option('--to <instant>');
  attach(analyticsAccountCommand, {
    name: 'analytics account',
    run: async (context, render) => {
      const [connectionId] = analyticsAccountCommand.args;
      const options = analyticsAccountCommand.opts<{ from?: string; to?: string }>();
      await analyticsAccount(context, render, connectionId ?? '', options);
    },
  });

  // -------------------------------------------------------------- growth ----
  const growth = program.command('growth').description('growth advisor');
  const plan = growth.command('plan').description('growth plans');

  const planGetCommand = plan
    .command('get <plan-id>')
    .description('a versioned plan summary. Risk: read');
  attach(planGetCommand, {
    name: 'growth plan get',
    run: async (context, render) => {
      const [planId] = planGetCommand.args;
      await growthPlanGet(context, render, planId ?? '');
    },
  });

  const planExportCommand = plan
    .command('export <plan-id>')
    .description('export a plan. Risk: read')
    .addOption(
      new Option('--format <format>', 'export format')
        .choices(['markdown', 'json', 'yaml'])
        .default('markdown'),
    );
  attach(planExportCommand, {
    name: 'growth plan export',
    run: async (context, render) => {
      const [planId] = planExportCommand.args;
      const options = planExportCommand.opts<{ format: string }>();
      await growthPlanExport(context, render, planId ?? '', options.format);
    },
  });

  // --------------------------------------------------------------- rules ----
  const rules = program.command('rules').description('automation rules');

  const rulesListCommand = rules
    .command('list')
    .description('rules and their limits. Risk: read')
    .option('--cursor <cursor>')
    .option('--limit <n>', 'page size', (value) => Number.parseInt(value, 10));
  attach(rulesListCommand, {
    name: 'rules list',
    run: async (context, render) => {
      const options = rulesListCommand.opts<{ cursor?: string; limit?: number }>();
      await rulesList(context, render, options);
    },
  });

  const rulesTestCommand = rules
    .command('test <rule-id>')
    .description('test run against a sample event. Performs no external action. Risk: read');
  attach(rulesTestCommand, {
    name: 'rules test',
    run: async (context, render) => {
      const [ruleId] = rulesTestCommand.args;
      await rulesTest(context, render, ruleId ?? '');
    },
  });

  // --------------------------------------------------------------- links ----
  const links = program.command('links').description('tracked short links');

  const linksCreateCommand = links
    .command('create <destination>')
    .description('mint a tracked short link. Risk: reversible. Requires --idempotency-key')
    .option('--campaign-id <id>')
    .option('--domain-id <id>')
    .option('--utm-source <value>')
    .option('--utm-medium <value>')
    .option('--utm-campaign <value>')
    .option('--utm-term <value>')
    .option('--utm-content <value>')
    .option('--idempotency-key <key>');
  attach(linksCreateCommand, {
    name: 'links create',
    run: async (context, render) => {
      const [destination] = linksCreateCommand.args;
      const options = linksCreateCommand.opts<{
        campaignId?: string;
        domainId?: string;
        utmSource?: string;
        utmMedium?: string;
        utmCampaign?: string;
        utmTerm?: string;
        utmContent?: string;
        idempotencyKey?: string;
      }>();
      await linksCreate(context, render, { destination: destination ?? '', ...options });
    },
  });

  const linksStatsCommand = links
    .command('stats <link-id>')
    .description('first-party redirect measurements. Risk: read')
    .option('--from <instant>')
    .option('--to <instant>')
    .option('--time-zone <iana-zone>', 'reporting time zone', 'UTC');
  attach(linksStatsCommand, {
    name: 'links stats',
    run: async (context, render) => {
      const [linkId] = linksStatsCommand.args;
      const options = linksStatsCommand.opts<{ from?: string; to?: string; timeZone?: string }>();
      await linksStats(context, render, linkId ?? '', options);
    },
  });

  // -------------------------------------------------------------- config ----
  const config = program.command('config').description('CLI settings. Never credentials');

  const configSetCommand = config
    .command('set <key> <value>')
    .description('set apiUrl, workspaceId, locale, output or profile');
  attach(configSetCommand, {
    name: 'config set',
    run: async (context, render) => {
      const [key, value] = configSetCommand.args;
      await configSet(context, render, key ?? '', value ?? '');
    },
  });

  const configUnsetCommand = config.command('unset <key>').description('clear one setting');
  attach(configUnsetCommand, {
    name: 'config unset',
    run: async (context, render) => {
      const [key] = configUnsetCommand.args;
      await configUnset(context, render, key ?? '');
    },
  });

  const configGetCommand = config.command('get [key]').description('read settings');
  attach(configGetCommand, {
    name: 'config get',
    run: async (context, render) => {
      const [key] = configGetCommand.args;
      await configGet(context, render, key);
    },
  });

  return program;
}

export interface RunResult {
  readonly exitCode: number;
}

/**
 * Run the CLI.
 *
 * Returns an exit code rather than calling `process.exit`, so tests can assert
 * on it and so a wrapper can decide what to do next.
 */
export async function runCli(argv: readonly string[], deps: CliDeps): Promise<RunResult> {
  const writer = deps.writer ?? processWriter;
  const state: ProgramState = { exitCode: EXIT_OK, json: false, writer };

  try {
    assertNoTokenInArgv(argv);
    const program = buildProgram({ ...deps, writer }, state);
    await program.parseAsync([...argv], { from: 'user' });
    return { exitCode: state.exitCode };
  } catch (error) {
    if (error instanceof CommanderError) {
      // `--help` and `--version` come through here as a successful exit.
      return { exitCode: error.exitCode === 0 ? EXIT_OK : EXIT_USAGE };
    }
    const relayError = RelayError.fromUnknown(error);
    renderFailure({ command: 'relay', json: state.json, writer }, relayError);
    return { exitCode: exitCodeFor(relayError.code) };
  }
}
