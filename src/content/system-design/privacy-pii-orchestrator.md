---
title: "Privacy / PII Request Orchestrator"
summary: "Compliance · GDPR Article 15 + 17 · Async fan-out across 6+ services"
stack:
  - "Kafka"
  - "DynamoDB"
  - "OneTrust"
  - "S3"
  - "IAM"
  - "IaC (CDK / CloudFormation)"
  - "OpenTelemetry"
  - "CloudWatch"
patterns:
  - "Service-registry orchestration"
  - "Two-stream Kafka contracts"
  - "Idempotent message handling"
  - "State-machine async fulfillment"
role: "Technical Lead II"
order: 1
status: "live"
diagramType: "svg"
diagramFile: "privacy-pii-orchestrator.svg"
---

**What it is.** A user privacy request (right of access or right to erasure) enters via OneTrust and is forwarded by a third-party broker to the Compliance Request Orchestrator. The orchestrator looks up which downstream services hold PII for that user via a service registry, then fans out across a Kafka request stream. Each downstream consumes its slice, processes (delete or export), and publishes a per-service result. The orchestrator aggregates results and calls the broker's fulfillment API once the aggregate state flips to complete.

**Why this shape.** The subject-request-ID drives idempotency end-to-end, so re-deliveries at any hop are safe. A service registry — rather than hardcoded routing — lets new PII-holding services join compliance by registering, with no orchestrator change. Two separate Kafka streams (request out, result in) give each downstream a clean inbound contract and the orchestrator a clean aggregation contract. State is split into per-service status and an aggregate; the aggregate flips to `complete` only when every individual settles, gating the fulfillment callback.
