---
title: "Multi-Brand Async Moderation Platform"
summary: "Trust & Safety · Multi-tenant · In-house text + image moderation"
stack:
  - "Kafka"
  - "AWS Lambda"
  - "S3"
  - "DynamoDB"
patterns:
  - "Two-stream Kafka contracts"
  - "Fault isolation via queue decoupling"
  - "Domain-based service boundaries"
role: "Technical Lead II"
order: 2
status: "live"
diagramType: "prose"
---

**What it is.** User-generated content — comments, nicknames, image uploads — from multiple brand surfaces flows through an internal API gateway, is identity-checked via CIAM, then published to a Kafka request stream. An inbound Lambda dispatches to two in-house classifiers: a text moderation processor for comments and nicknames, and a media processor for images. Both publish verdicts to a separate Kafka response stream; an outbound Lambda picks up each verdict and notifies the originating brand surface. Image bytes are stored in S3; record metadata and S3 keys live in DynamoDB.

**Why this shape.** Two streams (request out, response in) localise replay — a failure in moderation never re-drives the entire pipeline. Both classifiers are owned in-house: text moderation was migrated off a third-party vendor, image moderation absorbed from a sister team, eliminating vendor cost and returning policy ownership to the product team. Per-brand rules (banned terms, severity thresholds) are hot-reloadable without redeployment.
