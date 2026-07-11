---
title: "Service-Registry-Driven Fan-Out"
summary: "A compliance orchestrator needs to know which downstream services hold a given user's PII before it can fan out a GDPR/CCPA request — and that list changes as services launch, merge, and retire. Rather than hardcode routing, the orchestrator queries a service registry at request time to build the dispatch list, so new PII-holding services can self-register into compliance coverage without an orchestrator code change. Used in the Privacy / PII Request Orchestrator at Warner Bros. Discovery to fan out across 6+ downstream services."
stack:
  - "Kafka"
  - "DynamoDB"
patterns:
  - "Service-registry-driven fan-out"
  - "Domain-based service boundaries"
role: "Technical Lead II"
order: 4
status: "wip"
diagramType: "mermaid"
---

**The problem.** Downstream services that hold user data change over time — new services launch, existing ones get merged, and old ones get retired. If a compliance orchestrator's dispatch list is hardcoded, every new PII-holding service requires an orchestrator code change and redeploy, and it's easy to forget to update the list when a service is decommissioned or a new one ships. Miss an update either way and a GDPR/CCPA request either fans out to a service that no longer exists, or — worse — silently skips one that should have been included.

**The design decision.** Rather than hardcode routing, the orchestrator queries a service registry at request time to determine which downstream services to dispatch a given request to. Services register themselves (and what user data they hold) once; the orchestrator's dispatch logic becomes a lookup against that registry, not a static list maintained by whoever owns the orchestrator. The registry is intentionally separate storage from the orchestrator's own request-state DB — not the same DynamoDB table wearing two hats — so registry writes (a service onboarding or updating its declared data) can't contend with or get coupled to the orchestrator's per-request state churn.

**The trade-off.** Indirection adds a runtime dependency: if the registry is unavailable or stale, fan-out either stalls or silently under-dispatches. The mitigation is to treat the registry as load-bearing infrastructure rather than a side table, and to fail closed — stall and alert — rather than fan out on a possibly-incomplete list. Compared to the obvious alternative (a hardcoded service list reviewed at each release), the registry trades a small amount of runtime complexity and an extra failure mode for near-zero onboarding friction on the compliance side: new services self-serve into GDPR/CCPA coverage instead of waiting on an orchestrator owner to add them.

```mermaid
sequenceDiagram
    participant O as Compliance Request Orchestrator
    participant R as Service Registry
    participant K as Kafka Request Stream
    participant S as Downstream Service(s)

    O->>R: lookup(subjectRequestId, userId)
    R-->>O: [ServiceA, ServiceB, ServiceC, ...]
    loop for each registered service
        O->>K: dispatch(serviceId, subjectRequestId)
        K->>S: consume(subjectRequestId)
    end
```
