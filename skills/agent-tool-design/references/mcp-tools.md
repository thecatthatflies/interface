# MCP tools and function-calling schemas

Read this when designing or reviewing MCP tools, or function definitions for any model API. MCP details follow the specification revision 2026-07-28; function-calling details follow OpenAI's and Anthropic's published guidance.

Tags: **[E]** empirical, **[S]** standard or specification, **[P]** practitioner or vendor guidance, **[J]** judgment.

## Contents

1. From jobs to tools: a worked example
2. Description template
3. Input schema patterns
4. Result shapes
5. Error shape
6. Annotations
7. State, long work, and approval binding
8. Tool count and context cost
9. Security of tool metadata
10. Sources

## 1. From jobs to tools: a worked example

A support team wants an agent to handle billing questions. The API has 14 endpoints.

**Endpoint-shaped (bad):** `list_customers`, `get_customer`, `list_invoices`, `get_invoice`, `list_payments`, `get_payment`, `create_refund`, `list_notes`, `create_note`. To answer "why was Maya charged twice?", the agent lists customers (paging through thousands), finds Maya, lists invoices, lists payments, and compares them itself.

**Job-shaped (good):**

| Tool | Job | Effect |
|---|---|---|
| `find_customer` | Find a customer by email, name, or phone; returns top 5 matches with IDs | read |
| `get_billing_summary` | Recent invoices, payments, refunds, and flags (such as possible duplicate charge) for one customer | read |
| `refund_payment` | Refund all or part of one payment, with idempotency key | destructive, idempotent with key |
| `add_account_note` | Add a note visible to support staff | additive |

The same question now takes two reads and returns the answer the agent needs ("2 payments of $45.00 on 3 Nov 14:02 and 14:03 for INV-881; flagged as possible duplicate"). The flag is computed by code, because the model should not have to do arithmetic or comparisons it can get wrong [P: OpenAI, Anthropic].

Signs the set needs work [J]:

- Transcripts show the same 3-call sequence over and over: fold it into one tool.
- The model alternates between two tools for one request: they overlap.
- The model calls a list tool and then filters the result itself: add the filter parameter.
- The model passes a name where an ID is required: accept both, or rename the parameter.

## 2. Description template

```text
<Verb-first sentence: what it does, to what.>
Use when <situation>. For <neighboring situation>, use <other_tool>.
<Inputs: any format, unit, or default not obvious from the schema.>
Returns <shape>, at most <N> items; <how to continue>.
<Effect: read-only / creates X / permanently deletes X; reversible or not; who is notified.>
<Limits: permissions needed, rate, expiry of handles.>
```

Example:

```text
Refund all or part of one payment to the original payment method.
Use after get_billing_summary has identified the payment. To cancel an unpaid
invoice instead, use void_invoice.
amount_cents defaults to the full remaining amount.
Returns the refund ID and status (pending, succeeded, failed).
Money leaves the account and cannot be recalled; the customer gets an email.
Requires the billing:write scope. Reuse idempotency_key when retrying.
```

What to leave out: marketing ("powerful", "seamless"), restating the schema, instructions about other tools' behavior, anything addressed to the agent's priorities ("this is the most important tool") [J].

Parameter descriptions follow the same idea in one line: meaning, format, example, default. `"Payment ID from get_billing_summary, e.g. pay_3Nk2. Not an invoice ID."`

## 3. Input schema patterns

| Problem | Bad | Good | Basis |
|---|---|---|---|
| Fixed set in prose | `"status": {"type":"string","description":"open, closed or all"}` | `"status": {"type":"string","enum":["open","closed","all"],"default":"open"}` | [P: OpenAI, Anthropic] |
| Contradictory booleans | `include_archived`, `exclude_archived` | `"archived": {"enum":["exclude","include","only"]}` | [P: OpenAI] |
| Unqualified ID | `"id"` | `"payment_id"` with format example | [P: Anthropic] |
| Money as float | `"amount": 45.0` | `"amount_cents": 4500`, plus `currency` enum | [J], common API practice (Stripe) |
| Ambiguous time | `"date": "string"` | `"start": {"type":"string","format":"date-time","description":"ISO 8601 with offset, e.g. 2026-11-05T14:00:00-05:00"}` | [J] |
| Model asked for known context | `"current_user_id"` | Filled from the session in code | [P: OpenAI] |
| Free-form blob | `"payload": "object"` | Named, typed properties | [J] |
| Relative paths | `"path": "src/a.ts"` | Absolute path, or a project-root parameter set by code | [P: Anthropic] |
| No-parameter tool | `"inputSchema": null` | `{"type":"object","additionalProperties":false}` | [S: MCP] |

**Strict mode.** OpenAI strict function calling requires `additionalProperties: false` on every object and every property listed in `required`; optional fields allow `null` in their type [S: OpenAI docs]. If you target several clients, write schemas that satisfy strict mode, since they also work elsewhere [J].

**Lenient in code, strict in schema.** The schema describes the ideal call. Code accepts near misses that are unambiguous (`"ORD-1042"` and `"1042"`, trailing spaces, case) and rejects anything ambiguous with an error that shows the accepted form [P: Chrome; J].

## 4. Result shapes

A good result answers the question, names things the way a person would, includes the IDs the next call needs, and says whether there is more.

```json
{
  "content": [{ "type": "text", "text": "2 payments found for Maya Chen (cus_41). Possible duplicate: pay_3Nk2 and pay_3Nk3, both $45.00 for INV-881 on 3 Nov 2026 14:02 and 14:03 UTC. End of results." }],
  "structuredContent": {
    "customer": { "customer_id": "cus_41", "name": "Maya Chen" },
    "payments": [
      { "payment_id": "pay_3Nk2", "invoice_id": "INV-881", "amount_cents": 4500, "currency": "usd", "created_at": "2026-11-03T14:02:11Z", "status": "succeeded" },
      { "payment_id": "pay_3Nk3", "invoice_id": "INV-881", "amount_cents": 4500, "currency": "usd", "created_at": "2026-11-03T14:03:02Z", "status": "succeeded" }
    ],
    "flags": [{ "code": "POSSIBLE_DUPLICATE", "payment_ids": ["pay_3Nk2", "pay_3Nk3"] }],
    "total": 2,
    "next_cursor": null
  }
}
```

Rules:

- If `outputSchema` is declared, `structuredContent` must conform, and the server should also return the serialized JSON as text for backward compatibility [S: MCP].
- The text block may be a readable summary rather than raw JSON when clients pass it to the model; keep the facts identical between the two [J].
- Readable names alongside IDs reduced hallucinated identifiers in Anthropic's tests [P].
- Truncate with a statement, not silently: `"Showing 20 of 1,204 orders, newest first. Pass cursor=c_8f to continue, or narrow with status or date range."` [P: Anthropic]. Claude Code caps tool output at 25,000 tokens by default [P: Anthropic].
- Timestamps in ISO 8601 UTC in structured data; the text may also give a relative time [J].
- Outsider-written content (email bodies, web pages, file contents, issue comments) goes in a labeled field with its source, not merged into the tool's own sentence [J; see `interface-guidelines/references/oversight-and-safety.md` section 5].
- Large binary or long documents: return a `resource_link` the client can fetch, not inline base64 [S: MCP resource links].

## 5. Error shape

MCP has two channels [S: MCP Error Handling]:

| Class | Channel | Examples |
|---|---|---|
| Protocol error | JSON-RPC `error` | Unknown tool, arguments that fail the request schema, server crash |
| Tool execution error | Result with `isError: true` | Validation, not found, conflict, permission, rate limit, upstream failure, business rule |

Clients should pass execution errors to the model so it can self-correct; protocol errors are less likely to reach it or help [S]. So put everything recoverable in the second channel.

Recommended text layout [J, built on RFC 9457 and AIP-193]:

```text
<What failed, with the value>. <Why>. <What to do next, with the valid form or next tool>.
code=<STABLE_CODE> retryable=<true|false> [retry_after_seconds=<n>] [request_id=<id>]
```

Examples:

```text
No customer matches "maya@exmaple.com". Check the spelling, or search by name with find_customer(query="Maya Chen").
code=CUSTOMER_NOT_FOUND retryable=false

Payment pay_3Nk2 was already refunded in full on 4 Nov 2026 (re_77). Nothing to refund.
code=ALREADY_REFUNDED retryable=false

The billing service did not respond within 10 s. No refund was created. Retry with the same idempotency_key.
code=UPSTREAM_TIMEOUT retryable=true retry_after_seconds=30

Your token lacks the billing:write scope needed to refund. Ask the account owner to grant it; reads still work.
code=MISSING_SCOPE retryable=false
```

Note the third example: after a timeout, say whether the effect happened. If you do not know, say so and point to the idempotency key or a status tool, since "did it happen?" is exactly what the caller cannot answer alone [P: Stripe].

Where should structured error fields go? The spec says `structuredContent` must conform to `outputSchema` when one is declared, and does not define a separate error schema. Either include an `error` branch in your `outputSchema`, or keep error details in the text block as above [J]. Do not return a success-shaped object with `"ok": false` and `isError` unset: clients and models treat it as success.

Code catalogue: keep codes in one file, UPPER_SNAKE_CASE, never renamed once published; add new ones freely [S: AIP-193 reason format].

## 6. Annotations

From the MCP schema [S]:

| Hint | Default when absent | Meaning | Applies |
|---|---|---|---|
| `readOnlyHint` | false | Does not modify its environment | Always |
| `destructiveHint` | true | May perform destructive updates (false means additive only) | Only when `readOnlyHint` is false |
| `idempotentHint` | false | Repeating with the same arguments has no further effect | Only when `readOnlyHint` is false |
| `openWorldHint` | true | Interacts with an open world of external entities (web search) rather than a closed domain (a memory store) | Always |

Clients must treat annotations as untrusted unless the server is trusted, and annotations do not enforce anything [S: MCP; P: MCP blog, Hungerford, Morrow, Chang 2026]. Their value is in honest defaults that let a client skip approval for reads and insist on it for destructive calls.

Worked settings:

| Tool | readOnly | destructive | idempotent | openWorld |
|---|---|---|---|---|
| `search_orders` | true | | | false |
| `web_search` | true | | | true |
| `add_account_note` | false | false | false | false |
| `set_ticket_status` | false | false | true | false |
| `refund_payment` (with key) | false | true | true | false |
| `send_email` | false | true | false | true |
| `delete_project` | false | true | true | false |

`send_email` is marked destructive because it cannot be undone and reaches outside the system, which is the property approvals care about [J]. WebMCP uses a different vocabulary with opposite defaults; do not share annotation code between them (see `interface-guidelines/references/agent-surfaces.md` section 6).

## 7. State, long work, and approval binding

**Handles.** MCP has no protocol session, so state lives behind explicit handles returned by a creating tool and passed to later calls [S: MCP stateful tools]. Handles are opaque, checked against the caller's authorization on every call, given a stated lifetime ("baskets expire after 24 hours of inactivity", in the creating tool's description), and produce a clear execution error on expiry so the model can create a new one.

**Long work.** Return immediately with an operation handle and a status tool, or use MCP Tasks where the client supports them. Report states that mean different things: `queued`, `running`, `succeeded`, `failed`, `cancelled`, with progress where known [S: AIP-151; S: MCP Tasks extension]. "Accepted" is not "done".

**Plan and apply.** For consequential changes:

```text
plan_bulk_refund(customer_id, payment_ids) ->
  { plan_id, effect: "Refund 3 payments, $135.00 total, to card ending 4242",
    expires_at, plan_hash }
apply_bulk_refund(plan_id, idempotency_key) ->
  fails with PLAN_STALE if any payment changed since planning, returning a fresh plan
```

The person approves the effect sentence; the server applies exactly that or refuses [P: Chrome WebMCP guidance on binding to resource, version, and plan hash].

## 8. Tool count and context cost

- Every tool definition is sent on every model call. Large tool sets cost tokens and selection accuracy [P: Anthropic, OpenAI].
- OpenAI suggests fewer than 20 tools available at the start of a turn, as a soft guideline to test against [P].
- Beyond that, defer: expose a `search_tools` entry point, or let the agent call tools from code. Anthropic reported one case falling from about 150,000 to 2,000 tokens by presenting tools as code the agent loads on demand [P: Anthropic 2025, code execution with MCP].
- Deterministic ordering of `tools/list` lets clients cache the list and improves prompt-cache hits [S: MCP].
- `listChanged` notifications exist for real changes in what a caller may do, not for per-step menus [S: MCP; J].

## 9. Security of tool metadata

- Tool descriptions reach the model with high trust and are rarely read in full by people. Invariant Labs demonstrated "tool poisoning" in 2025: a harmless-looking tool whose description told the agent to read SSH keys and pass them as an argument [P: Invariant Labs, read through secondary reports].
- Keep metadata static and first-party. Do not build names, titles, or descriptions from user or upstream data [J].
- Strip zero-width, bidi-control, and Unicode tag characters from anything the model will read in metadata [J].
- Treat changes to tool definitions as code changes that need review. Clients such as MCP-Scan pin tool hashes to catch silent changes ("rug pulls") [P: Invariant Labs].
- The server must validate inputs, enforce access control, rate limit, and sanitize outputs [S: MCP security, MUST].

## 10. Sources

- MCP specification 2026-07-28, Tools: https://modelcontextprotocol.io/specification/latest/server/tools ; schema `ToolAnnotations`: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/schema/2026-07-28/schema.ts
- Hungerford, Morrow, Chang. "Tool annotations." MCP blog, 16 Mar 2026: https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/
- Aizawa, K. "Writing effective tools for AI agents." Anthropic Engineering, 11 Sep 2025: https://www.anthropic.com/engineering/writing-tools-for-agents
- Anthropic. "Code execution with MCP." Anthropic Engineering, 4 Nov 2025: https://www.anthropic.com/engineering/code-execution-with-mcp
- OpenAI. Function calling guide, best practices and strict mode: https://developers.openai.com/api/docs/guides/function-calling
- Google AIP-193 Errors, AIP-151 Long-running operations, AIP-163 Change validation: https://google.aip.dev/193 , https://google.aip.dev/151 , https://google.aip.dev/163
- RFC 9457 Problem Details for HTTP APIs: https://www.rfc-editor.org/rfc/rfc9457.html
- Stripe idempotent requests: https://docs.stripe.com/api/idempotent_requests
- Chrome WebMCP guidance and demos: https://developer.chrome.com/docs/ai/webmcp
- Invariant Labs, "MCP Security Notification: Tool Poisoning Attacks", April 2025 (read through secondary coverage; experiments at https://github.com/invariantlabs-ai/mcp-injection-experiments)
