# Exasol Integration & Backend Fixes Log

This document serves as a knowledge handoff for future AI agents working on this Murder Mystery Swarm codebase. It documents the critical bugs discovered while integrating `@exasol/exasol-driver-ts` and how they were resolved.

## 1. Exasol Reserved Keywords (`SOURCE`, `RESULT`)
**Issue:** 
Exasol strictly reserves certain keywords like `SOURCE` and `RESULT`. Attempting to use these as unquoted column names in `CREATE TABLE` statements fails silently (or with generic Syntax Error 42000), preventing tables like `EVIDENCE`, `EVENTS`, and `AGENT_ACTIONS` from being created.

**Resolution:** 
Completely eradicated the column name `source` across the database.
* Modified `db/schema.sql` and `db/seed.sql` to use `origin` instead of `source`.
* Avoided using `result` as a raw column without double-quotes (`"RESULT"`).

## 2. SQL Comment Parsing Bug in `schema.js`
**Issue:** 
The backend script `schema.js` split SQL files by `;` and then used `.filter(cmd => !cmd.startsWith('--'))` to ignore comments. However, because blocks like `CREATE TABLE` were immediately preceded by `--` comment blocks without semi-colons, the entire `CREATE TABLE` string was silently filtered out, resulting in no tables being created.

**Resolution:** 
Removed the `startsWith('--')` filter from `src/db/schema.js`. Exasol's native driver gracefully handles embedded SQL comments during execution.

## 3. Query vs Execute Driver Strictness
**Issue:**
`@exasol/exasol-driver-ts` enforces strict usage of `.query()` (for statements returning result sets) and `.execute()` (for DML/DDL statements). Mixing them up throws `E-EDJS-11: Invalid result type`.

**Resolution:**
All initialization scripts (`schema.js`) and database insertions (`queries.js`) strictly use `db.execute()`. All `SELECT` queries strictly use `db.query()`.

## 4. Column-Oriented Data Return & Blank UI Cards
**Issue:** 
The React frontend crashed (`cases.filter is not a function`) or rendered exactly 9 blank case cards. This occurred because `db.query()` in the Exasol driver does not return a JSON array of rows. Instead, it returns a raw WebSocket response containing column-oriented data arrays (`result.resultSet.data` contains arrays representing columns, not rows).

**Resolution:** 
Created a robust `mapResult` helper in `backend/src/db/queries.js`. 
* It iterates through `numRows` and dynamically pulls data from the column-oriented arrays (`result.resultSet.data[colIndex][rowIndex]`).
* It automatically camelCases fields (e.g. `created_at` -> `createdAt`) and maps snake_case primary keys (`case_id`, `event_id`) to the generic `id` property expected by the React components.

## 5. Connection Pool Limit (Parallel Execution Crashes)
**Issue:** 
When the React UI (like `CaseView.jsx`) mounts, it fires 5 simultaneous API requests to fetch messages, actions, timeline events, etc. The Exasol Driver defaults to a connection pool size of exactly 1 (`ConnectionPool(1)`). These parallel queries caused the backend to crash with `E-EDJS-8: Execution failed pool reached its limit from '1' parallel connections.`

**Resolution:** 
Implemented a custom asynchronous `Mutex` lock directly inside `backend/src/db/connection.js`. 
* Both `driverInstance.query` and `driverInstance.execute` were intercepted and wrapped in `dbMutex.lock()`.
* This safely serializes all incoming parallel API requests onto the single Exasol WebSocket connection, permanently fixing the crash without needing to rebuild the underlying `ExasolPool` architecture.
