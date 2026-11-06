# HTTP APIs agents call

Read this when designing an HTTP API's error format, retries, pagination, long-running work, or rate limits, whether agents call it directly or through an MCP server on top.

Tags: **[S]** standard or specification, **[P]** practitioner or vendor practice, **[J]** judgment.

## Contents

1. Error body
2. Status codes that change what the caller does
3. Idempotency
4. Validation-only and dry runs
5. Concurrency and freshness
6. Pagination and partial responses
7. Long-running operations
8. Rate limits
9. Deletion and reversal
10. Description and discovery
11. Sources

## 1. Error body

Use RFC 9457 problem details, `Content-Type: application/problem+json` [S]:

```json
{
  "type": "https://api.example.com/errors/amount-exceeds-paid",
  "title": "Refund amount exceeds amount paid",
  "status": 422,
  "detail": "Refund of 9999 cents exceeds the 4500 cents paid on payment pay_3Nk2. Use an amount between 1 and 4500.",
  "instance": "/v1/refunds/req_7Gq",
  "code": "AMOUNT_EXCEEDS_PAID",
  "param": "amount_cents",
  "limits": { "min": 1, "max": 4500 },
  "retryable": false,
  "request_id": "req_7Gq",
  "doc_url": "https://api.example.com/docs/errors#amount-exceeds-paid"
}
```

- `type` (a URI) identifies the problem class and is what clients branch on; `detail` is human-readable help for this occurrence, and clients should not parse it [S: RFC 9457].
- Extension members (`code`, `param`, `limits`, `retryable`) are allowed. Every variable mentioned in `detail` also appears as a field, so nothing must parse prose [S: AIP-193 says this of ErrorInfo metadata].
- A stable short reason code in UPPER_SNAKE_CASE, at most 63 characters, never reused for a different error [S: AIP-193].
- `param` names the field at fault, as Stripe does, so a client or form can point at it [P: Stripe].
- `doc_url` and `request_id` let a person or agent look up the error and let support find the log [P: Stripe `doc_url`, `request_log_url`].
- Validation failures on several fields return all of them at once, as GitHub's `422` returns an `errors` array with `missing_field`, `invalid`, `already_exists` codes [P: GitHub REST].

Bad: `{"error": "Something went wrong"}` with status 200. Bad: an HTML error page from the proxy on a JSON API. Bad: a stack trace in `detail`.

## 2. Status codes that change what the caller does

| Status | Caller should | Notes |
|---|---|---|
| 400 / 422 | Fix the request; do not retry unchanged | Say which field and the valid form |
| 401 | Re-authenticate | |
| 403 | Stop; ask for access | Name the missing scope where safe |
| 404 | Check the identifier | For resources the caller may not see, return the same as for missing ones or check permission first, so existence does not leak [S: AIP-193; P: GitHub returns 404 for private repositories] |
| 409 | Re-read and decide | Conflict, or idempotency key reused with different parameters [P: Stripe] |
| 412 | Re-read and retry with the new version | Precondition (ETag) failed |
| 424 / 502 / 503 / 504 | Retry later with backoff | Upstream or temporary; say whether the effect happened |
| 429 | Wait as told, then retry | `Retry-After` [S: RFC 9110] |
| 500 | Retry once if idempotent; otherwise check status | Include a request ID |

## 3. Idempotency

- Accept an `Idempotency-Key` header on every unsafe `POST` that creates something or moves money or messages [P: Stripe; S: IETF draft-ietf-httpapi-idempotency-key-header, not yet an RFC].
- Store the status and body of the first request with that key once execution begins, and return it for retries [P: Stripe].
- If the same key arrives with different parameters, return an error rather than either result [P: Stripe].
- Keep keys at least 24 hours [P: Stripe]. Allow keys up to 255 characters; advise random UUIDs and no personal data in keys [P: Stripe].
- `GET`, `PUT`, and `DELETE` are idempotent by definition and need no key [S: RFC 9110; P: Stripe].
- In the MCP tool on top, make `idempotency_key` a parameter and tell the model, in the description, to reuse it on retry [J].

## 4. Validation-only and dry runs

- A `validate_only=true` flag runs the same permission checks and validations as the live call and returns the same errors, without executing [S: AIP-163]. Parity is the point: a dry run that passes and a live call that fails is worse than no dry run.
- For large changes, return a plan object with a summary sentence, the exact effect, and a version or hash, which the apply call must cite [P: Chrome WebMCP guidance; J].

## 5. Concurrency and freshness

- Return an `ETag` or version field; accept `If-Match` on writes and fail with 412 when stale [S: RFC 9110; S: AIP-154].
- Agents act on what they read seconds or minutes ago. Without preconditions, they overwrite a person's newer edit without knowing [J].

## 6. Pagination and partial responses

- Cursor pagination with `page_size` and `next_page_token`; an empty token means the end [S: AIP-158].
- Bound `page_size` and state the default and the maximum. Return the total when it is cheap to compute [J].
- Let callers request fewer fields (`fields=id,status,total` or a field mask) to keep agent context small [S: AIP-157, AIP-161].
- Filters for the questions people ask (status, date range, owner), so agents never page through everything to filter locally [P: Anthropic tool guidance applies equally].

## 7. Long-running operations

- Return `202 Accepted` with an operation resource to poll, carrying `done`, a status, progress if known, and either the result or an error [S: AIP-151].
- Distinguish accepted, validated, applied, and confirmed. "Restart requested" is not "restarted" [S: Mac HIG via interface-guidelines; S: AIP-151].
- Allow cancel on operations that can be stopped, and say what a cancel leaves behind [J].

## 8. Rate limits

- 429 with `Retry-After` in seconds [S: RFC 9110]. Also expose remaining quota and reset time in headers, as GitHub does with `x-ratelimit-remaining` and `x-ratelimit-reset` [P: GitHub]. The IETF RateLimit header fields are a draft [S: draft].
- Say in the body which limit was hit and how to spread work ("100 writes per minute per token; batch with /v1/refunds:batch") [J].
- Set limits for machine speed: an agent can send in a second what a person sends in a day. Cap batch sizes and spend per token as well as request rate [J; see interface-guidelines oversight section 6].

## 9. Deletion and reversal

- Soft delete with a restore path and a stated retention period where feasible [S: AIP-164].
- Return what was deleted, and how to restore it, in the delete response [J].

## 10. Description and discovery

- Publish an OpenAPI description with an example request and response for each operation, including error examples [S: OpenAPI Initiative].
- Use the same nouns in paths, fields, docs, UI, and MCP tools. One word per concept everywhere [S: Mac HIG via interface-guidelines].
- Date-based or explicit versioning, with additive changes inside a version [P: Stripe API versioning].

## 11. Sources

- RFC 9457 Problem Details for HTTP APIs (2023): https://www.rfc-editor.org/rfc/rfc9457.html
- RFC 9110 HTTP Semantics, sections on Retry-After, conditional requests, idempotent methods: https://www.rfc-editor.org/rfc/rfc9110.html
- Google AIPs: 151 operations, 154 freshness, 157 partial responses, 158 pagination, 161 field masks, 163 validation, 164 soft delete, 193 errors: https://google.aip.dev/
- Stripe API errors: https://docs.stripe.com/api/errors ; idempotent requests: https://docs.stripe.com/api/idempotent_requests
- GitHub REST troubleshooting (404 for private resources, 422 error codes, rate-limit headers): https://docs.github.com/en/rest/using-the-rest-api/troubleshooting-the-rest-api
- IETF Idempotency-Key header draft: https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/
