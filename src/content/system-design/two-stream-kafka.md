---
title: "Two-Stream Kafka Pattern"
summary: "Separate Kafka streams for outbound requests and inbound results, each with its own replay point, used across the Privacy / PII Request Orchestrator and the Multi-Brand Async Moderation Platform at Warner Bros. Discovery. Each downstream service gets a clean, single-direction inbound contract; the upstream orchestrator gets an equally clean aggregation contract on the way back. A failure replays from the nearest stream instead of re-driving the whole pipeline."
stack:
  - "Kafka"
patterns:
  - "Two-stream Kafka pattern"
  - "Fault isolation via queue decoupling"
  - "Idempotent message handling"
role: "Technical Lead II"
order: 5
status: "wip"
diagramType: "mermaid"
---

**The problem.** A single shared Kafka topic carrying both "here's a request" and "here's a result" messages forces every consumer to filter for its own message type, and a slow or failing downstream consumer can back up the topic for everyone — including results flowing the other direction. Replay is messy too: rewinding "from the beginning" replays both directions of traffic at once, even if only one side actually needs reprocessing.

**The design decision.** Split into two streams: a request stream carrying outbound dispatch (orchestrator → downstream) and a separate result stream carrying the response direction (downstream → orchestrator). Each stream has its own replay point, so a downstream that needs to reprocess its inbound requests can rewind independently of the orchestrator's aggregation logic, and vice versa.

**The trade-off.** Two streams means two things to provision, monitor, and reason about instead of one — more moving infrastructure for a marginal conceptual win if traffic is genuinely low or single-consumer. It paid off here because the two directions have different consumers, different failure domains (an orchestrator-side bug shouldn't be able to wedge a downstream's inbound queue, and vice versa), and different replay needs — worth the extra topic for systems where one incident shouldn't cascade across both the fan-out and its aggregation.

```mermaid
sequenceDiagram
    participant O as Orchestrator
    participant RQ as Kafka Request Stream
    participant D as Downstream Service
    participant RS as Kafka Result Stream

    O->>RQ: publish(requestId, payload)
    RQ->>D: consume(requestId, payload)
    D->>D: process (delete / export / moderate)
    D->>RS: publish(requestId, result)
    RS->>O: consume(requestId, result)
    O->>O: aggregate per-service status
```
