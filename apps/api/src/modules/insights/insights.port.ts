import type { InsightService } from '@relay/application';

export type {
  DigestRowView,
  DigestSettingsView,
  DigestView,
  InsightView,
  OpenExperimentView,
  PostExperimentView,
  PostFeedbackView,
  WhatWorksView,
} from '@relay/application';

/**
 * The application surface the insight routes call.
 *
 * It is `services.insights` from `@relay/application`, the same use case the
 * MCP server and the CLI reach, bound under its own token so a test can hand
 * the module a double without building the whole `Services` object.
 */
export const INSIGHTS_PORT = Symbol('INSIGHTS_PORT');

export type InsightsPort = InsightService;
