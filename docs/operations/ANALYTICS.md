# Analytics Reference

This document explains how analytics in Recruitment Operations are computed and how to query them via APIs.

## Event model

- Table: `events`
- Common fields: `ts` (timestamp), `workspace_id`, `user_id`, `role_id`, `candidate_id`, `company`, `stage`, `event_name`, `value_numeric`, `meta`
- Key `event_name` values used by analytics:
  - `placement_created`
  - `interview_scheduled`
  - `cv_sent`
  - `task_completed`
  - `escalation_task_generated`, `auto_task_generated` (for insights only)

## Aggregations and performance

- Materialized views
  - `events_daily_counts(workspace_id, event_name, day, ct)`
  - `events_user_daily_counts(workspace_id, user_id, event_name, day, ct)`
  - `events_company_daily_counts(workspace_id, company, event_name, day, ct)`
- Refresh helper: `refresh_analytics_views()`
- Indexes exist on workspace and day columns for fast range scans.

## KPIs (definitions)

- Placements (QTD): count of `placement_created` in the current calendar quarter.
- Roles in progress: `COUNT(DISTINCT roles.id)` where `status NOT IN ('closed','lost')`.
- Urgent actions: open tasks with `priority IN ('high','urgent')`.
- Placements (range): sum of `ct` in `events_daily_counts` for `placement_created` in selected range.
- Interviews (range): same as above for `interview_scheduled`.
- CVs Sent (range): same as above for `cv_sent`.
- Deltas (%): `(current - previous) / max(previous, 1)` rounded to integer %; previous window is an equal-length period immediately before the current range.
- Quarter progress: `(now - quarter_start) / (quarter_end - quarter_start)`; UI also shows days left.

## Timeseries

- Metrics supported: `placements`, `interviews`, `cv_sent`, `tasks_completed`.
- Resolution: daily buckets across `7d`, `30d`, or `90d`.
- API also supports `prev=1` to request the previous equal-length window for comparison.

## Heatmap

- Data source: `/api/analytics/heatmap?metric=stage_moves` (or another metric)
- Window: last 84 days (12×7 grid)
- Coloring: square-root scale of day count vs max for balanced contrast.
- UI allows clicking a day to fetch event details for that date.

## Leaderboards

- Teammates: placements per `user_id` (sorted desc); server-side pagination via `limit` and `offset`.
- Companies: conversion rate = placements / CVs sent per company; tie-break by placements; pagination via `limit` and `offset`.

## APIs

All endpoints are scoped by `workspace_id` (RLS enforced). Query parameters are validated on the server.

- Summary
  - `GET /api/analytics/summary?workspaceId&range`
  - Returns `{ kpis: {...}, deltas: {...} }` including QTD metrics, range metrics, and deltas.
- Timeseries
  - `GET /api/analytics/timeseries?workspaceId&range&metric&prev?`
  - Returns `{ points: [{ t: ISO, v: number }, ...] }`.
- Heatmap
  - `GET /api/analytics/heatmap?workspaceId&range&metric`
  - Returns `{ cells: [{ d: 'YYYY-MM-DD', v: number }, ...] }`.
- Leaderboard
  - `GET /api/analytics/leaderboard?workspaceId&range&type=teammates|companies&limit&offset`
  - Returns `{ rows: [...], total }`.
- Events (details)
  - `GET /api/analytics/events?workspaceId&date?&range?&metric?&userId?&company?`
  - Returns `{ events: [{ name, ts, company, stage, userId }, ...] }`.

## Filters & views

- Filters: `range (7d|30d|90d)`, `metric`, `view (individual|team)` are persisted in the URL.
- Team view is gated to team plans; individual view is always available.

## Printing & export

- Export: CSV of the on-page activity list (client-generated).
- Print: print-friendly stylesheet hides controls and shadows.

## Security & permissions

- All analytics endpoints enforce workspace-scoped RLS.
- Team-level leaderboards and company analytics are available to team plans only.

## Troubleshooting

- Empty data: check `workspace_id` and that events exist in the selected range.
- Out-of-date aggregates: run `refresh_analytics_views()` (admin) or wait for periodic refresh in production.
- Slow responses: ensure indexes exist (included in schema), and verify request has appropriate filters.

