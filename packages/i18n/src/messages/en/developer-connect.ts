/**
 * Connecting an AI client to Relay.
 *
 * One screen, one decision: which client the person uses. Everything else is
 * derived from that choice. The credential sentences are deliberately blunt:
 * a person who learns "you cannot read this again" after navigating away has
 * already lost the credential, and no wording afterwards recovers it.
 *
 * Nothing here claims an agent is reachable. The only status this namespace
 * can express is what the workspace recorded: the last call, or that no call
 * has been recorded. There is no "online".
 */
export const developerConnectMessages = {
  'developer.connect.title': 'Connect your AI',
  'developer.connect.lede':
    'Pick the client you use. Relay gives you the configuration to paste and the credential it needs.',

  'developer.connect.clientLabel': 'Your client',
  'developer.connect.client.claudeCode': 'Claude Code',
  'developer.connect.client.claudeDesktop': 'Claude Desktop',
  'developer.connect.client.codex': 'Codex',
  'developer.connect.client.cursor': 'Cursor',
  'developer.connect.client.genericMcp': 'Any MCP client',
  'developer.connect.client.cli': 'Relay CLI',

  'developer.connect.step.credential': 'Step 1. Hold the credential',
  'developer.connect.step.config': 'Step 2. Paste this configuration',
  'developer.connect.step.verify': 'Step 3. Check that it connected',

  'developer.connect.credentialOnce':
    'The credential is shown once, at the moment you create or rotate it. Relay keeps only a hash of it, so this screen cannot show it to you again.',
  'developer.connect.credentialGone':
    'No credential is on this screen. If you no longer have it, rotate the credential and the new one will be shown once, here.',
  'developer.connect.credentialEnv':
    'Set {variable} in your shell or in your client. The configuration below reads it from there, so the credential is never written into a file you might commit.',

  'developer.connect.fileHint': 'Save this as {filename}.',
  'developer.connect.cliHint': 'Run these in a terminal.',
  'developer.connect.copy': 'Copy configuration for {client}',
  'developer.connect.copied': 'Configuration copied',

  'developer.connect.status.title': 'Connection',
  'developer.connect.status.lastCall': 'Last call from this agent {relativeTime}.',
  'developer.connect.status.never':
    'No call from this agent has been recorded. Use the activity log for this account to see what it has done.',

  'developer.connect.status.unavailable':
    'Activity for this agent could not be read, so nothing is shown here.',

  'developer.connect.firstRun.title': 'Connect an AI agent to this workspace',
  'developer.connect.firstRun.body':
    'A service account is the identity your agent acts as. It gets its own credential, its own limits and its own audit trail, separate from your account.',
  'developer.connect.firstRun.benefit.drafts':
    'Your agent can draft and schedule work through the same rules a person goes through.',
  'developer.connect.firstRun.benefit.limits':
    'You set what it may reach, how far ahead it may schedule, and how much it may do in a day.',
  'developer.connect.firstRun.benefit.stop':
    'Every call is recorded, and one button stops the agent without touching anyone else.',
} as const;
