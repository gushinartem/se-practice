# AI Usage Disclosure — SIS #04

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Date | Used for | Which files it touched |
| --- | --- | --- | --- | --- |
| Claude | Haiku 5.5 low | 14 November 2026 | codebase analysis (Task 1) | `report.md` (sections 2 and 3.1) |
| Claude | Haiku 5.5 low | 14 November 2026 | improvement plan | `report.md` (sections 3.2 and 3.3) |
| Claude | Haiku 5.5 low | 14 November 2026 | feature extension (Task 2) | `app/src/rooms.ts`, `app/src/filter.ts`, `app/src/App.tsx`, `app/src/index.css`, `report.md` (section 4) |
| Claude | Haiku 5.5 low | 14 November 2026 | refactoring (Task 3) | `app/src/booking.ts`, `app/src/time.ts`, `app/src/App.tsx`, `app/src/components/` (5 files), `diagrams/before.puml`, `diagrams/after.puml`, `report.md` (section 5) |
| Claude | Haiku 5.5 low | 14 November 2026 | tests (Task 4) | `app/src/booking.test.ts`, `app/src/checkRoom.test.ts`, `app/src/filter.test.ts`, `app/README.md`, `report.md` (sections 6 and 7) |

<!-- Delete rows you did not use the assistant for; add rows for anything else. The optional
     extension (an existing skill or a read-only MCP server) goes here too, with its permissions. -->

**The assistant wrote, or helped write, tests in `app/`:** no
<!-- Either answer is allowed. If "yes": which tests, and how you checked that their EXPECTED values
     come from AC1–AC5 and F1–F5, not from what the code happens to return. -->

**Every run pasted in report.md was produced by my code on my machine (or Codespace), unedited:** yes

**Every number in report.md section 7 was measured the way its row says:** yes

**I shared no credentials, keys or private data with any tool:** yes

**Everything I submitted, I can explain and defend in class — including filterRooms, checkRoom and
why each module exists:** yes

**Anything I accepted from the AI without fully understanding it:**
<!-- Name the file and the line. An honest entry here costs far less than a blank one that turns out to be untrue. -->

Signed: Guchshin Artem
Date: 2026.11.15
