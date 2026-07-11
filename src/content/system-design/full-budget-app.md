---
title: "Full Budget App"
summary: "Open source · Serverless · Multi-tenant · Event-driven categorisation · AWS CDK"
stack:
  - "AWS Lambda"
  - "DynamoDB"
  - "S3"
  - "SQS"
  - "Amazon Bedrock"
  - "AWS CDK"
  - "Apollo Server 5"
  - "GraphQL"
patterns:
  - "Event-driven ingestion"
  - "DynamoDB Streams"
  - "Hybrid NLP+AI categorisation"
  - "Multi-tenant isolation (tenantId PK)"
order: 3
status: "live"
diagramType: "svg"
diagramFile: "full-budget-app.svg"
---

Repo: [github.com/debrajpaul/full-budget-app](https://github.com/debrajpaul/full-budget-app)

**What it is.** A multi-tenant serverless budgeting platform built as a pnpm monorepo on AWS. Users upload bank statements (HDFC, SBI, Axis — PDF or CSV) via a GraphQL mutation; the statement lands in S3, an S3 event queues a message in SQS, and the txn-loaders Lambda parses and normalises the transactions into DynamoDB. A DynamoDB stream on the Transactions table immediately triggers the tag-loaders Lambda, which applies a deterministic NLP rule engine for known merchants and categories, falling back to Amazon Bedrock (Mistral) only for low-confidence matches. All 8 DynamoDB tables use `tenantId` as the partition key, giving hard data-boundary isolation between users.

**Why this shape.** S3 → SQS decouples ingestion from parsing — spiky upload volumes don't block the GraphQL API. DynamoDB Streams replace polling entirely: as soon as a transaction is written, the categorisation worker fires. The hybrid NLP+AI strategy keeps Bedrock calls (and their cost) to a minimum; most common merchants are classified by rules in under a millisecond. AWS CDK provisions all resources — tables, queues, buckets, alarms, X-Ray groups — as reproducible stacks with explicit dependency ordering.
