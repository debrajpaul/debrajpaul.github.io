---
title: "Backfill Search-Indexing Pipeline (DynamoDB → OpenSearch)"
summary: "An offline extract-then-transform backfill that uses DynamoDB's native export-to-S3 feature to pull the full content corpus without touching production read capacity, then lets a downstream ETL step pick up from S3 and index into OpenSearch. Built at Warner Bros. Discovery to backfill search indexing across the full content corpus without impacting production DynamoDB."
stack:
  - "DynamoDB"
  - "S3"
  - "OpenSearch"
patterns:
  - "Offline-extract-then-transform for backfill"
role: "Technical Lead II"
order: 6
status: "wip"
diagramType: "mermaid"
---

**The problem.** Backfilling a search index for the full content corpus by scanning the application's live DynamoDB tables would compete with production traffic for read capacity. A backfill scan touching the entire corpus is exactly the kind of workload that can degrade latency for real users if it runs against the same table currently serving them.

**The design decision.** Use DynamoDB's native export-to-S3 feature to pull a full point-in-time copy of the table without consuming provisioned or on-demand read capacity — native export reads from the underlying storage layer rather than the table's normal read path. The S3 write itself is the trigger: an S3 event fires automatically the moment the export lands, kicking off the downstream ETL step with no polling or manual step required. ETL picks up the exported data, transforms it into the document shape OpenSearch expects, and indexes it, decoupled entirely from the production table.

**The trade-off.** Native export-to-S3 isn't real-time — it's a point-in-time snapshot, so this pattern fits a backfill or a periodic reindex, not keeping a search index continuously in sync with live writes (that's a separate streaming concern). The win is that a backfill of the full corpus can run without production incident risk, at the cost of the index being only as fresh as the last export.

```mermaid
flowchart LR
    DDB[("DynamoDB<br/>production table")] -- native export --> S3[("S3<br/>point-in-time export")]
    S3 --> ETL["Downstream ETL<br/>extract → transform"]
    ETL --> OS[("OpenSearch<br/>index")]
```
