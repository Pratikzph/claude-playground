---
name: codepractice
description: Enforce organization coding standards: camelCase variables and underscore-prefixed private methods
trigger: /codepractice
---

# /codepractice

Review and fix code to comply with the organization's coding standards:

1. **camelCase** for every variable name (local variables, parameters, fields, constants)
2. **Underscore prefix (`_`)** for every private method name

## Usage

```
/codepractice                    # review and fix current working directory
/codepractice <file>             # review and fix a specific file
/codepractice <path>             # review and fix all code files under a path
/codepractice --check            # report violations only, do not fix
/codepractice <file> --check     # check a specific file, report only
```

## What You Must Do When Invoked

### Step 1 — Determine scope

- If no path was given, use `.` (current working directory).
- If `--check` flag is present, report violations but do not modify files.
- Identify all code files in scope. Supported extensions: `.py`, `.js`, `.ts`, `.java`, `.cs`, `.go`, `.rb`, `.swift`, `.kt`, `.cpp`, `.c`, `.rs`.

### Step 2 — Read each file

Read each file and identify violations:

**Rule 1 — camelCase variables**
- Every variable declaration, parameter name, local binding, and field/property must use camelCase.
- camelCase: starts with a lowercase letter, each subsequent word starts uppercase. No underscores, no ALL_CAPS (unless the language mandates it for true compile-time constants, in which case note but do not change).
- Violations: `snake_case_var`, `PascalCaseVar` (unless it is a class/type name — do NOT rename classes or types), `UPPER_CASE` (unless it is a language-mandated constant).
- Do NOT rename: class names, type names, interface names, enum type names, imported symbols from external libraries.

**Rule 2 — Underscore-prefixed private methods**
- Every private method (functions/methods marked private, or by convention private in languages without access modifiers) must have a name starting with `_`.
- Public or protected methods must NOT start with `_`.
- Already-compliant names (e.g. `_doWork`) must not be changed.
- Constructor methods are exempt — do not add `_` to constructors.

### Step 3 — Report violations

For each file, list violations in this format:

```
FILE: <path>
  [VAR]    line <N>: '<original>' → '<fixed>'   (camelCase required)
  [METHOD] line <N>: '<original>' → '<fixed>'   (private method must start with _)
```

If no violations, print: `FILE: <path> — OK`

Show the full violation report before making any changes.

### Step 4 — Apply fixes (unless --check)

If `--check` was NOT given, apply all fixes:

- Rename each violating variable/parameter/field to its camelCase form.
- Rename each violating private method by adding `_` prefix (or correcting casing).
- Update ALL references to the renamed symbol within the same file.
- If a symbol is exported or used across files, note it as a cross-file rename and ask the user whether to proceed before changing call sites in other files.

After applying fixes, print a summary:

```
Fixed <N> violation(s) in <M> file(s).
```

### Step 5 — Cross-file renames (if any)

If any renamed symbol is referenced in other files, list them:

```
Cross-file references detected for '<symbol>':
  - <file>:<line>
  ...
Apply renames in these files too? (yes/no)
```

Wait for user confirmation before touching other files.

## camelCase conversion rules

| Original form       | camelCase result  |
|---------------------|-------------------|
| `my_variable`       | `myVariable`      |
| `MyVariable`        | `myVariable`      |
| `MY_CONSTANT`       | (skip — true constant) |
| `getuser_name`      | `getUserName`     |
| `__dunder__`        | (skip — Python dunder) |

- Split on underscores and on case transitions.
- Lowercase the first segment entirely.
- Capitalize the first letter of every subsequent segment.
- Collapse consecutive underscores as one separator.

## Private method prefix rules

| Original name   | Fixed name     | Note                          |
|-----------------|----------------|-------------------------------|
| `doWork`        | `_doWork`      | private, missing prefix       |
| `_doWork`       | `_doWork`      | already correct, no change    |
| `__init__`      | `__init__`     | dunder — exempt               |
| `calculate`     | `_calculate`   | private, missing prefix       |
| `PublicMethod`  | `PublicMethod` | public — do NOT add prefix    |

## Honesty rules

- Never rename a symbol you are not sure about — when in doubt, list it as a warning and ask.
- Never rename class names, type aliases, or external library symbols.
- Never silently skip a file — always print its status.
- Always show the violation report before applying changes.
