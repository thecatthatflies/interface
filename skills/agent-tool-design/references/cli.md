# CLIs that people, scripts, and agents run

Read this when building or reviewing a command-line tool that an agent or a script will run. clig.dev and 12 Factor CLI were written for people and scripts; agents arrive through the scripting path, so the same rules serve them. The agent-specific benefit of each rule is unmeasured [J].

Tags: **[S]** standard, **[P]** practitioner, **[J]** judgment.

## Contents

1. Streams and output
2. Machine-readable output
3. Exit codes
4. Input, flags, and prompts
5. Mutations: preview, confirmation, repeat safety
6. Errors
7. Help and discovery
8. Robustness and secrets
9. Test script
10. Sources

## 1. Streams and output

- Primary output goes to stdout; logs, progress, warnings, and errors go to stderr [P: clig.dev]. An agent piping `--json` to a parser must never get a progress line in the middle.
- Decide formatting per stream by checking whether it is a TTY. No color when not a TTY, when `NO_COLOR` is set and non-empty, when `TERM=dumb`, or with `--no-color` [P: clig.dev; S: no-color.org convention].
- No spinners or animations when stdout is not a terminal; no pager unless stdin and stdout are terminals [P: clig.dev].
- After a change, say what changed and what to run next: `Created deploy dpl_81 (status: building). Watch it: app deploy status dpl_81` [P: clig.dev].
- Print something within about 100 ms, before any network call, so a person or a supervising agent knows it started [P: clig.dev].

## 2. Machine-readable output

- `--json` on every command that prints data. Human output can change between versions; scripts and agents rely on `--json` or `--plain` [P: clig.dev].
- Make the JSON schema additive: add fields, never rename or remove without a deprecation period. Snapshot-test the keys [J].
- Let callers choose fields where output is wide, as `gh` does with `gh pr list --json number,title,state` [P: GitHub CLI].
- Stream large or unbounded output as NDJSON (one object per line) so a reader can stop early [P: Poehnelt].
- Lists default to a bounded page, with `--limit` and a way to continue, and state when output was cut. Print the cut notice on stderr so stdout stays valid JSON [J].
- Machine output carries the same facts as human output, including partial failures: `{"succeeded": 8, "failed": [{"id": "f_2", "code": "PERMISSION_DENIED"}]}` [J].
- Offer a schema for agents to discover arguments and output, for example `app schema deploy` printing JSON Schema [P: Poehnelt; unmeasured].

## 3. Exit codes

- 0 on success, non-zero on failure, and distinct codes for the failure classes a caller would handle differently [P: clig.dev].
- A workable map, borrowed in part from BSD `sysexits.h` [J]:

  | Code | Meaning |
  |---|---|
  | 0 | Success |
  | 1 | General failure |
  | 2 | Usage error (bad flag or argument) |
  | 3 | Not found |
  | 4 | Permission denied or not logged in |
  | 5 | Conflict or precondition failed (stale version, already exists) |
  | 6 | Partial success; some items failed (details in `--json`) |
  | 7 | Rate limited or temporarily unavailable; safe to retry |
  | 130 | Interrupted by Ctrl-C (128 + SIGINT) |

  Document the map in `--help`. Whatever map you pick, never change a code's meaning once published [J].

## 4. Input, flags, and prompts

- Prefer flags to positional arguments; every flag has a long form; single letters only for common flags [P: clig.dev].
- Use standard names: `-h/--help`, `--version`, `-n/--dry-run`, `-f/--force`, `-o/--output`, `-q/--quiet`, `--json`, `--no-input`. Avoid `-v` meaning both verbose and version [P: clig.dev].
- Prompt only when stdin is a TTY. With `--no-input`, or without a TTY, a missing value fails immediately and names the flag that supplies it [P: clig.dev]:

  ```text
  Bad:  ? Which environment? (hangs until timeout)
  Good: error: --env is required when not running interactively.
        Pass --env staging or --env production.
  ```

- Accept `-` for stdin and stdout. Accept a JSON payload (`--input-json file.json` or from stdin) for complex input, alongside flags rather than instead of them [P: clig.dev; Poehnelt and Mastykarz disagree on flags versus JSON; keeping both settles it].
- Make flag order irrelevant, and do not allow arbitrary prefix abbreviations of subcommands, which break when a new subcommand is added [P: clig.dev].
- Harden inputs against agent mistakes: reject control characters, `../`, and URL fragments in IDs and paths, and resolve relative paths against a stated root [P: Poehnelt].

## 5. Mutations: preview, confirmation, repeat safety

- `--dry-run` on every command that changes state. It runs every validation and permission check, changes nothing, and prints the plan, in JSON with `--json` [P: clig.dev; S: AIP-163 on parity]. Models to copy: `terraform plan` then `terraform apply plan.out`, and `kubectl apply --dry-run=server` [P].
- Scale confirmation to severity [P: clig.dev]:

  | Severity | Interactive | Non-interactive |
  |---|---|---|
  | Mild (reversible, local) | None, or optional | None |
  | Moderate (hard to reverse) | Prompt, offer `--dry-run` | Requires `--yes` or `--force` |
  | Severe (irreversible, shared, costly) | Type the resource name | Requires `--confirm=<name>` |

  A destructive command run without a TTY and without the flag refuses, exits non-zero, and says which flag to pass. It does not proceed silently [P: clig.dev].
- Say what a confirmation will do, with names and counts: `Delete 3 buckets in production (logs-eu, logs-us, tmp-7)? Type "production" to confirm.` [S: Smith and Mosier 6.3/16 via interface-guidelines].
- Make commands safe to re-run: create-if-absent, resume where stopped, crash-only design with no cleanup that must run [P: clig.dev].
- For remote creates, send an idempotency key and accept `--idempotency-key` so a retried command does not create twice [P: Stripe CLI practice; J].

## 6. Errors

- Catch expected errors and rewrite them: what went wrong, how to fix it, and the most important line last, where the eye lands [P: clig.dev].
- Group repeated errors under one header instead of printing 400 identical lines [P: clig.dev].
- With `--json`, errors are JSON on stderr with a stable code, alongside the readable message [J]:

  ```json
  {"error": {"code": "NOT_LOGGED_IN", "message": "You are not logged in.", "fix": "Run: app auth login", "retryable": false}}
  ```

- Suggest likely typos, but ask before running the suggestion [P: clig.dev].
- Unexpected errors: one line of explanation, where the full trace was written, and how to report it [P: clig.dev].

## 7. Help and discovery

- `-h` and `--help` on every command and subcommand, examples first, common flags first [P: clig.dev].
- Run with missing required arguments, show concise help: one line of purpose, one or two examples, pointer to `--help` [P: clig.dev].
- Each example in help is a real, copy-pasteable command that works against a test account [J].
- `--version` prints a parseable version. Agents use it to pick documentation [J].
- Help states exit codes, the environment variables read, and config file locations [J].

## 8. Robustness and secrets

- Do not read secrets from flags (they land in shell history and process lists) or, by default, from environment variables; use a credential file, stdin, or a helper [P: clig.dev]. For agents, prefer short-lived, scoped tokens from a file or helper [J].
- Configurable network timeouts with a sensible default; a hung network call is the most common way an agent's CLI call wastes its time budget [P: clig.dev; J].
- Ctrl-C exits promptly and says so; a second Ctrl-C skips cleanup [P: clig.dev].
- Config precedence: flags, then environment, then project config, then user config, then system config [P: clig.dev].
- Do not change behavior based on detecting an agent. Behavior depends on flags and TTY state only [J; matches interface-guidelines' rule against forking by detection].

## 9. Test script

Run these against any CLI before calling it agent-ready:

```bash
cmd --help                                   # examples present, exit 0
cmd --version                                # parseable
cmd list --json 2>/dev/null | jq -e . >/dev/null && echo "json ok"
NO_COLOR=1 cmd list | grep -c $'\e' || true  # expect 0
timeout 5 cmd create </dev/null; echo "exit $?"   # must fail fast naming the flag, not 124
cmd delete thing-1 </dev/null; echo "exit $?"     # must refuse without --confirm
cmd delete thing-1 --dry-run --json          # plan only; verify nothing changed
cmd create --name a --idempotency-key k1 && cmd create --name a --idempotency-key k1   # one object
cmd get does-not-exist; echo "exit $?"       # not-found code, message with fix
```

Snapshot the `--json` keys of each command and diff them on every release.

## 10. Sources

- Prasad, Firshman, Tashian, Parish. Command Line Interface Guidelines: https://clig.dev/
- Dickey, J. 12 Factor CLI Apps: https://jdxcode.medium.com/12-factor-cli-apps-dd3c227a0e46
- NO_COLOR convention: https://no-color.org/
- GitHub CLI `--json` field selection: https://cli.github.com/manual/gh_help_formatting
- Poehnelt, J. "Rewrite your CLI for AI agents": https://justin.poehnelt.com/posts/rewrite-your-cli-for-ai-agents/ (practitioner opinion, no measurements; Waldek Mastykarz argues for keeping flags)
- Google AIP-163 Change validation: https://google.aip.dev/163
