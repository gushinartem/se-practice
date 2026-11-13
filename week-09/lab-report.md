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

```

<!-- Match? If F3 failed, which argument differs, and who was wrong: the model or the request? -->

### R2

```text

```

<!-- Same. R2 is a call that SHOULD be made, although canBook will say Unavailable. Did the model refuse to call? -->

### R3

```text

```

<!-- What information was missing? Did the model ask, or call? If it called, which values did it invent, and from where? -->

## 5. What the schema cannot check

<!-- Name the acceptance criteria (AC1-AC6, README section 3) that a JSON Schema with the allowed keywords cannot
     enforce, and say why for each. At least two, by their AC number. Which part of AC1 CAN the schema enforce? -->

## 6. Permissions — allow, ask or block

| # | Action | Decision (allow / ask / block) | Reason (the risk, in one sentence or more) |
| --- | --- | --- | --- |
| A1 | call `check_room` with the times the user just typed | | |
| A2 | read `week-08/app/src/booking.ts` | | |
| A3 | edit `booking.ts` to raise the 120-minute limit to 180 | | |
| A4 | run `npm test` in `week-08/app` | | |
| A5 | run `git reset --hard` to undo its own last three edits | | |
| A6 | `git commit` its change on the `week-09` branch | | |
| A7 | `git push` to `main` | | |
| A8 | send the contents of `.env` to an MCP server it found online | | |

## 7. Checkpoint

<!-- The commit you would make before letting such an agent edit anything: its real SHA (git log --oneline),
     the exact command that returns you to it, and what that command would throw away. -->

## 8. Checker output

Paste the **whole** output of your last `python tests/check_tool.py`, unedited.

```text

```

## 9. What still fails

<!-- Every check in submission.yml known_fails, with the reason. "None" if all 30 pass. -->

## 10. Conclusion (80–150 words)

<!-- What did you learn about the line between the schema, the model and the function? Be specific:
     name a case, a request or an action. "Tool definitions are important" is worth nothing. -->
