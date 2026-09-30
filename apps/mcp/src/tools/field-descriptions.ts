/**
 * What each tool argument means, for the model reading `tools/list`.
 *
 * Model-facing like the tool descriptions, and kept in one table so the same
 * argument is explained the same way in every tool: `connection_id` always
 * says where to get one. A field whose meaning differs between tools gets a
 * per-tool entry. `server.ts` writes these into the JSON Schema it declares,
 * and the registry test fails if any argument of any tool is left without one.
 */

export const FIELD_DESCRIPTIONS: Readonly<Record<string, string>> = {
  approver_ids: 'Optional member ids to ask. Omit to use the workspace approval policy.',
  body: 'The post text.',
  brief: 'What the post should say, in plain words, when drafting from a brief.',
  business_profile_id: 'A confirmed business profile id from the workspace.',
  campaign_id: 'Optional campaign id to file the draft under.',
  category: 'Optional opportunity category to filter by.',
  confirmation_id:
    'The id returned by the first publish_post call, once a person has approved it in Post Array.',
  connection_id: 'A connected account id (conn_...) from list_accounts.',
  connection_ids: 'Connected account ids (conn_...) from list_accounts. Omit for every target.',
  content_item_id: 'A draft or post id (content_...) from draft_post or get_calendar.',
  content_kind: 'Optional post format, for example text, image, video or carousel.',
  cursor: 'Opaque cursor from the previous page. Omit for the first page.',
  from: 'Start of the range, as an ISO 8601 instant.',
  iana_time_zone: 'IANA time zone the instant was chosen in, for example Europe/Berlin.',
  idempotency_key:
    'A key you choose (8 to 255 of A-Z a-z 0-9 _ . : -). Repeat it when retrying the same action so it happens once.',
  instant: 'When to publish, as an ISO 8601 instant with an offset.',
  item_ids: 'Growth plan item ids from get_growth_plan.',
  job_id: 'A publish job id from schedule_post or get_calendar.',
  limit: 'How many results to return, at most 25.',
  locale: 'Optional BCP 47 language tag of the post, for example en or pt-BR.',
  media_id: 'A media id (media_...) from list_media or import_media.',
  media_ids: 'Optional media ids (media_...) from list_media or import_media.',
  note: 'Optional note for the approvers.',
  plan_id: 'A growth plan id.',
  project_id: 'A project id (project_...) from list_projects.',
  provider: 'Optional platform to filter by, for example linkedin or bluesky.',
  reason: 'Optional reason, recorded on the receipt.',
  receipt_id: 'A publication receipt id from list_recent_receipts.',
  region: 'Optional region to filter by.',
  since: 'Optional ISO 8601 instant. Only activity after it is returned.',
  target_characters: 'Optional target length in characters.',
  target_language: 'BCP 47 language tag to transcreate into.',
  targets: 'The accounts to post to, one entry per account.',
  title: 'Optional internal title for the draft. It is not published.',
  to: 'End of the range, as an ISO 8601 instant.',
  tone: 'Optional tone for the suggestion.',
  url: 'An https URL of an image or video the person gave you.',
  verified_after: 'Optional ISO 8601 instant. Only opportunities verified after it are returned.',
};

export const TOOL_FIELD_DESCRIPTIONS: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  draft_post: {
    project_id: 'Required. The project the draft belongs to (project_...), from list_projects.',
    body: 'The master post text every target starts from.',
  },
  list_media: { kind: 'Optional media kind to filter by, for example image or video.' },
  preview_commit: {
    kind: 'publish_now to preview publishing immediately, or schedule to preview a scheduled time.',
    instant: 'For schedule: when to publish, as an ISO 8601 instant with an offset.',
  },
  suggest_copy: {
    kind: 'What to suggest: a draft from a brief, hooks, calls to action, a shorter version, a tone change, a platform variant or a transcreation.',
    body: 'Optional existing text to work from.',
    connection_id: 'Optional account id (conn_...) to tailor the suggestion to.',
    content_item_id: 'Optional draft id (content_...) to work from.',
  },
  review_draft: { body: 'The text to review, when there is no saved draft.' },
  get_analytics: {
    connection_id: 'Optional account id (conn_...) to limit the numbers to.',
    from: 'Optional start of the period, as an ISO 8601 instant.',
    to: 'Optional end of the period, as an ISO 8601 instant.',
  },
  cancel_post: { job_id: 'The scheduled publish job id to cancel, from get_calendar.' },
};

export function describeField(toolName: string, field: string): string | undefined {
  return TOOL_FIELD_DESCRIPTIONS[toolName]?.[field] ?? FIELD_DESCRIPTIONS[field];
}
