# Week 09 — Lab Report: canBook as a Tool

Fill in every section. Do not delete or renumber the headings: the README and the checker point at
them. Replace every `<!-- comment -->` with your own text (comments are ignored by the checker).

**Name:** Artem Guchshin
**Student ID:** 24B031011
**GitHub:** gushinartem

---

## 1. Setup

| | |
| --- | --- |
| Assistant (frozen for the whole lab) | Claude |
| Exact model (or "not displayed") | Haiku 5.5 low |
| Three fresh chats for R1, R2, R3? (yes / no) | yes |
| Python version (`python --version`) | Python 3.14.7 |

## 2. Your tool definition — a reason for every constraint

Paste your final `tool/check_room.json`, then fill the table: one row per constraint you wrote.

```json
{
  "name": "check_room",
  "description": "Checks whether a room can be booked for a requested time slot. It only checks and answers Available or Unavailable; it does not save, change or create any booking. All times are whole minutes since midnight, from 0 to 1440, so 10:00 is 600 and 24:00 is 1440. The slot must start after the current time, be at most 120 minutes long, avoid a blocked room, and not overlap existing bookings (touching is allowed).",
  "inputSchema": {
    "type": "object",
    "properties": {
      "start": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested start time, in whole minutes since midnight (10:00 = 600)."
      },
      "end": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested end time, in whole minutes since midnight (24:00 = 1440)."
      },
      "now": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "The current time, in whole minutes since midnight."
      },
      "blocked": {
        "type": "boolean",
        "description": "True if the room is blocked (for example for maintenance), false otherwise."
      },
      "bookings": {
        "type": "array",
        "description": "Existing bookings for the room. May be empty.",
        "items": {
          "type": "object",
          "properties": {
            "start": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440,
              "description": "Booking start, in whole minutes since midnight."
            },
            "end": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440,
              "description": "Booking end, in whole minutes since midnight."
            }
          },
          "required": ["start", "end"],
          "additionalProperties": false
        }
      }
    },
    "required": ["start", "end", "now", "blocked", "bookings"],
    "additionalProperties": false
  }
}
```

| Field | Constraint (e.g. `"type": "integer"`, `"maximum": 1440`) | What goes wrong without it |
| --- | --- | --- |
| whole schema | `"type": "object"` | The model could send a bare number or list as the arguments, and the client could not map them to the five named fields. |
| whole schema | `"required": ["start", "end", "now", "blocked", "bookings"]` | A call without `now` (S04) would be accepted, and `canBook` would run with a missing input and could not decide "start after now" (AC1). |
| whole schema | `"additionalProperties": false` | The model could invent a field such as `"room": "204"` (S05). The call would pass, and the invented field would be silently ignored or break the function. |
| `start` | `"type": "integer"` | A fractional time such as 600.5 (S10) or a string such as `"10:00"` would be accepted, although the unit is whole minutes. |
| `start` | `"minimum": 0` | A negative time such as -30 (S06) would be accepted, although it falls before the day starts (AC1). |
| `start` | `"maximum": 1440` | A start after the end of the day would be accepted. |
| `end` | `"type": "integer"` | The model could send `"11:00"` as a string (S03). It is valid JSON but not a number of minutes, so the function would compare text with numbers. |
| `end` | `"minimum": 0` | A negative end time would be accepted, although it falls before the day starts. |
| `end` | `"maximum": 1440` | An end such as 1500 (S07) would be accepted, although it is past midnight (AC1). It is also what lets 1440 (24:00) stay valid (S11). |
| `now` | `"type": "integer"`, `"minimum": 0`, `"maximum": 1440` | The model could guess the time as text or send a value outside the day, and the "start after now" check would then compare against nonsense. |
| `blocked` | `"type": "boolean"` | The string `"false"` (S09) is truthy in many languages, so a free room would be treated as blocked (AC3). |
| `bookings` | `"type": "array"` (no `minItems`) | Without the array type, the bookings could arrive as one object or as text. Leaving out `minItems` keeps `[]` valid for a room with no bookings (S02). |
| `bookings` items | `"type": "object"` | A booking written as a pair such as `[660, 720]` (S12) would be accepted, but the function reads `.start` and `.end`. |
| `bookings` items | `"required": ["start", "end"]` | A booking with only a start (S08) would be accepted, and the overlap check (AC4) would have no end to compare. |
| `bookings` items | `"additionalProperties": false` | Extra keys inside a booking would pass, and a misspelled `end` such as `"stop"` would not be caught as a mistake. |
| `bookings` items `start` / `end` | `"type": "integer"`, `"minimum": 0`, `"maximum": 1440` | A booking with a fractional or out-of-day time would pass, and the overlap check would run on impossible values. |
| `description` (tool) | text stating minutes, 0–1440, "does not save" | The model would not know the unit or the range, and could send hours or clock strings. It might also treat the tool as one that creates a booking (AC5). |

## 3. The twelve calls — first run and final run

Your **first** run's S verdicts (before any fix), and your final ones. For every case that changed,
say what you changed.

| Case | First run | Final run | What you changed |
| --- | --- | --- | --- |
| S01 | PASS | PASS | Nothing: the valid R1 call is accepted. |
| S02 | PASS | PASS | Nothing: `bookings` is a plain array with no `minItems`, so `[]` is accepted. |
| S03 | PASS | PASS | Nothing: `"type": "integer"` on `end` refuses the string `"11:00"`. |
| S04 | PASS | PASS | Nothing: `now` is listed in `required`, so a call without it is refused. |
| S05 | PASS | PASS | Nothing: `"additionalProperties": false` refuses the extra `room` field. |
| S06 | PASS | PASS | Nothing: `"minimum": 0` on `start` refuses -30. |
| S07 | PASS | PASS | Nothing: `"maximum": 1440` on `end` refuses 1500. |
| S08 | PASS | PASS | Nothing: the booking item requires both `start` and `end`. |
| S09 | PASS | PASS | Nothing: `"type": "boolean"` on `blocked` refuses the string `"false"`. |
| S10 | PASS | PASS | Nothing: `"type": "integer"` on `start` refuses 600.5. |
| S11 | PASS | PASS | Nothing: `end` allows a maximum of 1440, so 24:00 is accepted. |
| S12 | PASS | PASS | Nothing: booking items are `"type": "object"`, so the pair `[660, 720]` is refused. |

## 4. Function calling — what the model wrote

For each request, paste the model's reply exactly, then judge it against the request.

### R1

```text
{"name": "check_room", "arguments": {"start": 600, "end": 660, "now": 540, "blocked": false, "bookings": [{"start": 660, "end": 720}]}}
```

<!-- Match? If F3 failed, which argument differs, and who was wrong: the model or the request? -->
F1, F2 and F3 all PASS. The model replied with one JSON object and nothing else, with the right tool name. Every argument matches the request:

- `start` = 600 (10:00), `end` = 660 (11:00) and `now` = 540 (9:00), so all three conversions are correct.
- `blocked` = false, taken from "It isn't blocked".
- `bookings` = one booking from 660 to 720, which is the existing 11:00 to 12:00 booking.

Nobody was wrong here: the request gave every value explicitly, and the model converted them correctly. The schema accepted the call, which only means the shape is right. The booking touches the requested slot at 660, so `canBook` would answer Available (AC4 allows touching), and that decision belongs to the function, not the schema.
### R2

```text
{"name": "check_room", "arguments": {"start": 840, "end": 990, "now": 810, "blocked": true, "bookings": []}}
```

<!-- Same. R2 is a call that SHOULD be made, although canBook will say Unavailable. Did the model refuse to call? -->
F4, F5 and F6 all PASS. The model replied with one call to `check_room`, with valid arguments that match the request:

- `start` = 840 (14:00), `end` = 990 (16:30) and `now` = 810 (13:30), so all three conversions are correct. In particular, 16:30 became 990, not 960, so the half hour was kept.
- `blocked` = true, taken from "blocked for maintenance today".
- `bookings` = `[]`, taken from "there are no other bookings". The model did not invent a booking.

Nobody was wrong here: the request gave every value, and the model converted them correctly. The model did not refuse to call because the room is blocked. This is the right behavior, because a blocked room is data for the function, not a reason to skip the call. The schema accepted the call because the shape is valid. `canBook` would answer Unavailable for two reasons: the room is blocked (AC3) and the slot is 150 minutes, over the 120-minute limit (AC2). Both decisions belong to the function, not to the schema.
### R3

```text
{"name": "check_room", "description": "Checks whether a room can be booked for a requested time slot.", "arguments": {"message": "Could you tell me the exact start time you’d like, and the current time so I can check availability?"}}
```

<!-- What information was missing? Did the model ask, or call? If it called, which values did it invent, and from where? -->
The request leaves almost everything out. Missing: `now` (the current time), the exact `start` and `end` ("tomorrow afternoon" and "a couple of hours" are vague, and "tomorrow" is also a different day from the one `now` refers to), `blocked`, and `bookings`.

The model did not follow the instruction to reply with one short question. It wrote a call to `check_room` and hid the question inside an invented argument, `message`. It also added a `description` key that the requested form does not have. I saved the reply as `r3.json` exactly as it came, because it is a call object and not a plain question.

The model invented no values: it did not make up a start time, a `now`, a `blocked` flag or a booking list. It saw that the start time and the current time were missing, but its question does not cover `blocked`, `bookings`, the length of "a couple of hours", or what "afternoon" means.

F7 PASSES only because exactly one of the two files exists and is not empty. The checker does not judge the content. This call would not pass my schema: `message` is not allowed (`additionalProperties: false`, the same case as S05), and all five required fields are missing. So the schema would stop it before `canBook` ran, but the model should have asked a plain question that the user could answer.
## 5. What the schema cannot check

<!-- Name the acceptance criteria (AC1-AC6, README section 3) that a JSON Schema with the allowed keywords cannot
     enforce, and say why for each. At least two, by their AC number. Which part of AC1 CAN the schema enforce? -->
A JSON Schema with the allowed keywords checks the **shape** of each value on its own. It cannot compare two values with each other, and it cannot look at anything outside the call. These criteria therefore stay in `canBook`:

- **AC1, `start < end`:** the schema can compare a value with a fixed number (`minimum`, `maximum`), but not one field with another. `"start": 600` with `"end": 600` or `"end": 500` is a valid call, because both numbers are in range.
- **AC1, "start after `now`":** this also compares two fields, `start` and `now`, so the schema cannot enforce it. A call with `start` = 540 and `now` = 810 is valid in shape, but the slot is already in the past.
- **AC2, at most 120 minutes:** the length is `end - start`, which needs arithmetic on two fields. The R2 call (840 to 990, 150 minutes) passes the schema, but the slot is too long.
- **AC3, not when blocked:** the schema only checks that `blocked` is a boolean. `"blocked": true` is a perfectly valid value, and what it means for the answer is a decision. R2 is a call that should be made even though the room is blocked.
- **AC4, no overlap (touching allowed):** overlap depends on comparing the requested slot with every booking in the list. The schema cannot do this, and it also cannot see whether a booking's own `start` is below its `end`.
- **AC5, does not change or save anything:** this is a property of the function's behavior, not of its input. A schema describes the arguments, so it cannot guarantee what the code does with them. Only the description tells the model that the tool does not save.

**What the schema CAN enforce from AC1:** the fixed-range part. Each time must be a whole number between 0 and 1440 (`"type": "integer"`, `"minimum": 0`, `"maximum": 1440`). This refuses `-30` (S06), `1500` (S07) and `600.5` (S10). It cannot enforce the part of AC1 that relates two values to each other.

In short, the schema checks that each value is the right kind of thing in the right range, and `canBook` decides whether the values make sense together.
## 6. Permissions — allow, ask or block

| # | Action | Decision (allow / ask / block) | Reason (the risk, in one sentence or more) |
| --- | --- | --- | --- |
| A1 | call `check_room` with the times the user just typed | allow | The tool only reads and answers Available or Unavailable (AC5), so a wrong or rejected call changes nothing; the schema also refuses malformed arguments before `canBook` runs. |
| A2 | read `week-08/app/src/booking.ts` | allow | Reading a source file inside the repository changes nothing, and `booking.ts` is application logic rather than a file with secrets, so the only cost of a wrong read is wasted attention. |
| A3 | edit `booking.ts` to raise the 120-minute limit to 180 | ask | This changes the business rule AC2, not just code: one user's request for 3 hours does not authorize a policy change for everyone, and the tests, the page feedback and the `check_room` description would stop matching the code, so a human must approve it first. |
| A4 | run `npm test` in `week-08/app` | allow | Running the tests only reads the code and reports results, so it gives the agent useful feedback at little risk; the one risk is that `npm test` runs the project's own script, but this is my own Week 08 project and any change it made inside the repository can be reviewed and undone with git. |
| A5 | run `git reset --hard` to undo its own last three edits | ask | `git reset --hard` throws away all uncommitted changes in the working directory, not just the agent's own three edits, so my own unsaved work could be lost for good; a human should confirm what it will discard, and it becomes safe once the work is committed as a checkpoint. |
| A6 | `git commit` its change on the `week-09` branch | allow | A commit on the working branch is local and easy to undo, and it protects the agent's work from a later `git reset --hard`; the small risk is committing a file that should not be saved, such as `.env`, which is why the review happens before any push. |
| A7 | `git push` to `main` | block | Pushing to `main` publishes the change to the shared branch and is hard to undo once others pull it; this course requires all work on `week-09` with the PR left open and never merged, so the agent has no legitimate reason to touch `main`. |
| A8 | send the contents of `.env` to an MCP server it found online | block | `.env` holds secrets such as API keys, and sending them to an unverified server cannot be undone except by rotating every key; "to configure it" is what a malicious server or prompt injection would say, and no legitimate setup needs the raw file. |

## 7. Checkpoint

<!-- The commit you would make before letting such an agent edit anything: its real SHA (git log --oneline),
     the exact command that returns you to it, and what that command would throw away. -->
Before letting an agent edit anything, I would first make sure that `git status` says the working tree is clean, and make a commit that holds all my work so far. The checkpoint commit in my repository is:

```text
ccc94c2 week-09: add model calls R1-R3 and report section 4-6
```

SHA: `ccc94c2`

If the agent damages something and I want to go back to this state, the command is:

```bash
git reset --hard ccc94c2
```

What this command throws away:

- every change in the working directory that is not committed, including edits the agent made to tracked files, and any of my own unsaved edits made after the checkpoint;
- every commit made after `ccc94c2` on `week-09`. They would no longer be on the branch and would stay reachable only through `git reflog` for a limited time.

It does **not** throw away anything that was committed at or before `ccc94c2`, because the reset restores exactly that snapshot. Untracked new files that the agent created are not removed by `git reset --hard`, so I would also have to check `git status` and delete them myself or with `git clean`. This is why the checkpoint must be committed first: work that is not in a commit cannot be brought back by this command.
## 8. Checker output

Paste the **whole** output of your last `python tests/check_tool.py`, unedited.

```text
PASS  D1    tool/check_room.json exists and is valid JSON
PASS  D2    has name, description and inputSchema
PASS  D3    name is exactly "check_room"
PASS  D4    description: 25+ words, says minutes, 1440, and that it does not save
PASS  D5    inputSchema: an object with exactly the five fields, all required
PASS  D6    inputSchema uses only the keywords listed in README section 5
PASS  S01   the R1 call, valid -> accept
PASS  S02   no existing bookings: bookings = [] -> accept
PASS  S03   end as a string: "11:00" -> refuse
PASS  S04   now missing -> refuse
PASS  S05   an extra field: "room": "204" -> refuse
PASS  S06   start below the day: -30 -> refuse
PASS  S07   end beyond the day: 1500 -> refuse
PASS  S08   a booking with no end: {start: 660} -> refuse
PASS  S09   blocked as a string: "false" -> refuse
PASS  S10   start not a whole minute: 600.5 -> refuse
PASS  S11   end at the end of the day: 1440 -> accept
PASS  S12   a booking as a pair: [660, 720] -> refuse
PASS  F1    calls\r1.json: a call to check_room
PASS  F2    calls\r1.json: arguments valid against your schema
PASS  F3    calls\r1.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F4    calls\r2.json: a call to check_room
PASS  F5    calls\r2.json: arguments valid against your schema
PASS  F6    calls\r2.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F7    calls/r3: exactly one of r3.json (it called) or r3.txt (it asked), not empty
PASS  L1    section 5 names at least two acceptance criteria (AC1-AC6) the schema cannot check
PASS  L2    section 6: A1-A8 each have allow / ask / block and a reason of 5+ words
PASS  L3    section 7 names the checkpoint commit (a SHA)
PASS  L4    section 10: a conclusion of 80-150 words
PASS  L5    AI_USAGE.md filled in (a tool row, and signed)

SUMMARY: 30 PASS · 0 FAIL · 0 ERROR  (of 30 checks)
```

## 9. What still fails

<!-- Every check in submission.yml known_fails, with the reason. "None" if all 30 pass. -->
None. The last run of `python tests/check_tool.py` shows 30 PASS, 0 FAIL and 0 ERROR, so `known_fails` in `submission.yml` is empty.

One observation that no check catches: the R3 reply passes F7 only because a non-empty file exists. The model did not follow the instruction to ask a plain question, and the content of that reply is analysed in section 4 (R3).
## 10. Conclusion (80–150 words)

<!-- What did you learn about the line between the schema, the model and the function? Be specific:
     name a case, a request or an action. "Tool definitions are important" is worth nothing. -->
This lab showed me three separate layers. The schema checks shape: all twelve S cases passed, so malformed calls such as `"end": "11:00"` or an extra `room` field are refused before `canBook` runs. The model converts and fills arguments: in R2 it correctly turned 16:30 into 990 and still made the call although the room was blocked. But in R3 it ignored the instruction to ask a plain question and hid it in an invented `message` argument, so a model cannot be trusted to follow the format. The function decides meaning: R2 is a valid call that `canBook` must still answer Unavailable (AC2, AC3). Finally, A5 and A8 showed me that an agent's permissions must be limited by risk, not by good intentions.
