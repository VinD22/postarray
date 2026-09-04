import { Command, CommanderError, Option } from 'commander';

import { RelayError } from '@relay/contracts';
import { createTranslator, en, loadCatalog } from '@relay/i18n';
import type { Translator } from '@relay/i18n';

import { assertNoTokenInArgv } from './config/credentials';
import { createContext } from './context';
import { resolveCliLocale } from './context';
import type { CliContext, CliDeps, GlobalOptions } from './context';
import { EXIT_OK, EXIT_USAGE, exitCodeFor } from './exit-codes';
import { processWriter, renderFailure } from './output';
import type { RenderInput, Writer } from './output';
import { localizeHelp } from './help';

import { authLogin, authLogout, authWhoAmI } from './commands/auth';
import type { LoginFlow } from './commands/auth';
import { configGet, configSet, configUnset } from './commands/config';
import { eventsWatch } from './commands/events';
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

const englishHelpTranslator = createTranslator('en', en);

interface CommandRunInput {
  readonly name: string;
  readonly run: (context: CliContext, render: RenderInput) => Promise<void>;
}

interface ProgramState {
  exitCode: number;
  json: boolean;
  writer: Writer;
  translator?: Translator;
}

function globalsFrom(command: Command): GlobalOptions {
  const options = command.optsWithGlobals<{
    json?: boolean;
    profile?: string;
    apiUrl?: string;
    workspaceId?: string;
    locale?: string;
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
    locale: options.locale,
  };
}

function argvOption(argv: readonly string[], name: string): string | undefined {
  const prefix = `${name}=`;
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === name) {
      return argv[index + 1];
    }
    if (value?.startsWith(prefix)) {
      return value.slice(prefix.length);
    }
  }
  return undefined;
}

async function helpTranslatorFor(argv: readonly string[], deps: CliDeps): Promise<Translator> {
  try {
    const config = await deps.configStore.read();
    const profileName =
      argvOption(argv, '--profile') ?? deps.env.RELAY_PROFILE ?? config.defaultProfile;
    const profile = config.profiles[profileName] ?? {};
    const locale = resolveCliLocale({ locale: argvOption(argv, '--locale') }, profile, deps.env);
    return createTranslator(locale, await loadCatalog(locale));
  } catch {
    return englishHelpTranslator;
  }
}

export function buildProgram(
  deps: CliDeps,
  state: ProgramState,
  helpTranslator: Translator = englishHelpTranslator,
): Command {
  const program = new Command();

  program
    .name('postarray')
    .description(localizeHelp(helpTranslator, 'root'))
    .version(VERSION, '-V, --version')
    .configureOutput({
      writeOut: (text) => state.writer.out(text.replace(/\n$/, '')),
      writeErr: (text) => state.writer.err(text.replace(/\n$/, '')),
    })
    .exitOverride()
    .option('--json', localizeHelp(helpTranslator, 'optionJson'), false)
    .option('--profile <name>', localizeHelp(helpTranslator, 'optionProfile'))
    .option('--api-url <url>', localizeHelp(helpTranslator, 'optionApiUrl'))
    .option('--workspace-id <id>', localizeHelp(helpTranslator, 'optionWorkspaceId'))
    .option('--locale <bcp47>', localizeHelp(helpTranslator, 'optionLocale'))
    .option('--dry-run', localizeHelp(helpTranslator, 'optionDryRun'), false)
    .option('--yes', localizeHelp(helpTranslator, 'optionYes'), false);

  const attach = (command: Command, input: CommandRunInput): Command =>
    command.action(async () => {
      const options = globalsFrom(command);
      state.json = options.json;
      const context = await createContext(options, { ...deps, writer: state.writer });
      const render: RenderInput = {
        command: input.name,
        json: options.json,
        writer: state.writer,
        translator: context.translator,
      };
      await input.run(context, render);
    });

  // ---------------------------------------------------------------- auth ----
  const auth = program.command('auth').description(localizeHelp(helpTranslator, 'authGroup'));

  const loginCommand = auth
    .command('login')
    .description(localizeHelp(helpTranslator, 'authLogin'))
    .addOption(
      new Option('--flow <flow>', localizeHelp(helpTranslator, 'authFlow'))
        .choices(['device', 'authorization-code'])
        .default('device'),
    )
    .option('--scope <scope...>', localizeHelp(helpTranslator, 'authScopes'))
    .option('--workspace <id>', localizeHelp(helpTranslator, 'authWorkspace'));
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

  attach(auth.command('logout').description(localizeHelp(helpTranslator, 'authLogout')), {
    name: 'auth logout',
    run: authLogout,
  });

  attach(auth.command('whoami').description(localizeHelp(helpTranslator, 'authWhoami')), {
    name: 'auth whoami',
    run: authWhoAmI,
  });

  // ------------------------------------------------------------ accounts ----
  const accounts = program
    .command('accounts')
    .description(localizeHelp(helpTranslator, 'accountsGroup'));

  const accountsListCommand = accounts
    .command('list')
    .description(localizeHelp(helpTranslator, 'accountsList'))
    .option('--provider <provider>')
    .option('--project-id <id>')
    .option('--cursor <cursor>')
    .option('--limit <n>', localizeHelp(helpTranslator, 'pageSize'), (value) =>
      Number.parseInt(value, 10),
    );
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
    .description(localizeHelp(helpTranslator, 'accountsCapabilities'));
  attach(capabilitiesCommand, {
    name: 'accounts capabilities',
    run: async (context, render) => {
      const [connectionId] = capabilitiesCommand.args;
      await accountsCapabilities(context, render, connectionId ?? '');
    },
  });

  // --------------------------------------------------------------- posts ----
  const posts = program.command('posts').description(localizeHelp(helpTranslator, 'postsGroup'));

  const validateCommand = posts
    .command('validate [file]')
    .description(localizeHelp(helpTranslator, 'postsValidate'))
    .option('--content-item <id>', localizeHelp(helpTranslator, 'postsExistingDraft'))
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
    .description(localizeHelp(helpTranslator, 'postsPreview'))
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
    .description(localizeHelp(helpTranslator, 'postsSchedule'))
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
    .description(localizeHelp(helpTranslator, 'postsPublish'))
    .option('--content-item <id>')
    .option('--file <path>')
    .option('--project-id <id>')
    .option('--idempotency-key <key>')
    .option('--confirm', localizeHelp(helpTranslator, 'postsConfirm'), false);
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
    .description(localizeHelp(helpTranslator, 'postsStatus'));
  attach(statusCommand, {
    name: 'posts status',
    run: async (context, render) => {
      const [jobId] = statusCommand.args;
      await postsStatus(context, render, jobId ?? '');
    },
  });

  const cancelCommand = posts
    .command('cancel <job-id>')
    .description(localizeHelp(helpTranslator, 'postsCancel'))
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
    .description(localizeHelp(helpTranslator, 'postsList'))
    .option('--state <state>')
    .option('--project-id <id>')
    .option('--cursor <cursor>')
    .option('--limit <n>', localizeHelp(helpTranslator, 'pageSize'), (value) =>
      Number.parseInt(value, 10),
    );
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
  const media = program.command('media').description(localizeHelp(helpTranslator, 'mediaGroup'));

  const mediaListCommand = media
    .command('list')
    .description(localizeHelp(helpTranslator, 'mediaList'))
    .option('--project-id <id>')
    .option('--kind <kind>', localizeHelp(helpTranslator, 'mediaKind'))
    .option('--cursor <cursor>')
    .option('--limit <n>', localizeHelp(helpTranslator, 'pageSize'), (value) =>
      Number.parseInt(value, 10),
    );
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
    .description(localizeHelp(helpTranslator, 'mediaGet'));
  attach(mediaGetCommand, {
    name: 'media get',
    run: async (context, render) => {
      const [mediaId] = mediaGetCommand.args;
      await mediaGet(context, render, mediaId ?? '');
    },
  });

  const mediaUploadCommand = media
    .command('upload <file>')
    .description(localizeHelp(helpTranslator, 'mediaUpload'))
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
    .description(localizeHelp(helpTranslator, 'mediaImport'))
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
  const calendar = program
    .command('calendar')
    .description(localizeHelp(helpTranslator, 'calendarGroup'));
  const calendarListCommand = calendar
    .command('list')
    .description(localizeHelp(helpTranslator, 'calendarList'))
    .requiredOption('--from <instant>')
    .requiredOption('--to <instant>')
    .option('--project-id <id>')
    .option('--cursor <cursor>')
    .option('--limit <n>', localizeHelp(helpTranslator, 'pageSize'), (value) =>
      Number.parseInt(value, 10),
    );
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
  const receipts = program
    .command('receipts')
    .description(localizeHelp(helpTranslator, 'receiptsGroup'));
  const receiptsGetCommand = receipts
    .command('get <receipt-id>')
    .description(localizeHelp(helpTranslator, 'receiptsGet'));
  attach(receiptsGetCommand, {
    name: 'receipts get',
    run: async (context, render) => {
      const [receiptId] = receiptsGetCommand.args;
      await receiptsGet(context, render, receiptId ?? '');
    },
  });

  // -------------------------------------------------------------- events ----
  const eventsCommand = program
    .command('events')
    .description(localizeHelp(helpTranslator, 'eventsWatch'))
    .option('--follow', localizeHelp(helpTranslator, 'eventsFollow'), false)
    .option('--no-reconnect', localizeHelp(helpTranslator, 'eventsNoReconnect'))
    .option('--since <id>', localizeHelp(helpTranslator, 'eventsSince'))
    .option('--type <type...>', localizeHelp(helpTranslator, 'eventsType'))
    .option('--limit <n>', localizeHelp(helpTranslator, 'pageSize'), (value) =>
      Number.parseInt(value, 10),
    );
  attach(eventsCommand, {
    name: 'events',
    run: async (context, render) => {
      const options = eventsCommand.opts<{
        follow?: boolean;
        reconnect?: boolean;
        since?: string;
        type?: string[];
        limit?: number;
      }>();
      await eventsWatch(context, render, {
        follow: options.follow === true,
        reconnect: options.reconnect !== false,
        since: options.since,
        type: options.type,
        limit: options.limit,
      });
    },
  });

  // ----------------------------------------------------------- analytics ----
  const analytics = program
    .command('analytics')
    .description(localizeHelp(helpTranslator, 'analyticsGroup'));

  const analyticsPostCommand = analytics
    .command('post <receipt-id>')
    .description(localizeHelp(helpTranslator, 'analyticsPost'));
  attach(analyticsPostCommand, {
    name: 'analytics post',
    run: async (context, render) => {
      const [receiptId] = analyticsPostCommand.args;
      await analyticsPost(context, render, receiptId ?? '');
    },
  });

  const analyticsAccountCommand = analytics
    .command('account <connection-id>')
    .description(localizeHelp(helpTranslator, 'analyticsAccount'))
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
  const growth = program.command('growth').description(localizeHelp(helpTranslator, 'growthGroup'));
  const plan = growth.command('plan').description(localizeHelp(helpTranslator, 'growthPlan'));

  const planGetCommand = plan
    .command('get <plan-id>')
    .description(localizeHelp(helpTranslator, 'growthPlanGet'));
  attach(planGetCommand, {
    name: 'growth plan get',
    run: async (context, render) => {
      const [planId] = planGetCommand.args;
      await growthPlanGet(context, render, planId ?? '');
    },
  });

  const planExportCommand = plan
    .command('export <plan-id>')
    .description(localizeHelp(helpTranslator, 'growthPlanExport'))
    .addOption(
      new Option('--format <format>', localizeHelp(helpTranslator, 'growthFormat'))
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
  const rules = program.command('rules').description(localizeHelp(helpTranslator, 'rulesGroup'));

  const rulesListCommand = rules
    .command('list')
    .description(localizeHelp(helpTranslator, 'rulesList'))
    .option('--cursor <cursor>')
    .option('--limit <n>', localizeHelp(helpTranslator, 'pageSize'), (value) =>
      Number.parseInt(value, 10),
    );
  attach(rulesListCommand, {
    name: 'rules list',
    run: async (context, render) => {
      const options = rulesListCommand.opts<{ cursor?: string; limit?: number }>();
      await rulesList(context, render, options);
    },
  });

  const rulesTestCommand = rules
    .command('test <rule-id>')
    .description(localizeHelp(helpTranslator, 'rulesTest'));
  attach(rulesTestCommand, {
    name: 'rules test',
    run: async (context, render) => {
      const [ruleId] = rulesTestCommand.args;
      await rulesTest(context, render, ruleId ?? '');
    },
  });

  // --------------------------------------------------------------- links ----
  const links = program.command('links').description(localizeHelp(helpTranslator, 'linksGroup'));

  const linksCreateCommand = links
    .command('create <destination>')
    .description(localizeHelp(helpTranslator, 'linksCreate'))
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
    .description(localizeHelp(helpTranslator, 'linksStats'))
    .option('--from <instant>')
    .option('--to <instant>')
    .option('--time-zone <iana-zone>', localizeHelp(helpTranslator, 'reportingTimeZone'), 'UTC');
  attach(linksStatsCommand, {
    name: 'links stats',
    run: async (context, render) => {
      const [linkId] = linksStatsCommand.args;
      const options = linksStatsCommand.opts<{ from?: string; to?: string; timeZone?: string }>();
      await linksStats(context, render, linkId ?? '', options);
    },
  });

  // -------------------------------------------------------------- config ----
  const config = program.command('config').description(localizeHelp(helpTranslator, 'configGroup'));

  const configSetCommand = config
    .command('set <key> <value>')
    .description(localizeHelp(helpTranslator, 'configSet'));
  attach(configSetCommand, {
    name: 'config set',
    run: async (context, render) => {
      const [key, value] = configSetCommand.args;
      await configSet(context, render, key ?? '', value ?? '');
    },
  });

  const configUnsetCommand = config
    .command('unset <key>')
    .description(localizeHelp(helpTranslator, 'configUnset'));
  attach(configUnsetCommand, {
    name: 'config unset',
    run: async (context, render) => {
      const [key] = configUnsetCommand.args;
      await configUnset(context, render, key ?? '');
    },
  });

  const configGetCommand = config
    .command('get [key]')
    .description(localizeHelp(helpTranslator, 'configGet'));
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
    const helpTranslator = await helpTranslatorFor(argv, deps);
    state.translator = helpTranslator;
    const program = buildProgram({ ...deps, writer }, state, helpTranslator);
    await program.parseAsync([...argv], { from: 'user' });
    return { exitCode: state.exitCode };
  } catch (error) {
    if (error instanceof CommanderError) {
      // `--help` and `--version` come through here as a successful exit.
      return { exitCode: error.exitCode === 0 ? EXIT_OK : EXIT_USAGE };
    }
    const relayError = RelayError.fromUnknown(error);
    renderFailure(
      { command: 'postarray', json: state.json, writer, translator: state.translator },
      relayError,
    );
    return { exitCode: exitCodeFor(relayError.code) };
  }
}
