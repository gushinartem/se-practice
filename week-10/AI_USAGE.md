# AI Usage Disclosure — Week 10

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

# AI Usage Disclosure — Week 10
| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Claude (claude.ai web chat, files attached) | Claude Haiku 5.5, low effort | read-only risk review (Task 2) | none — "WITHOUT editing files" |
| Claude (claude.ai web chat, files attached) | Claude Haiku 5.5, low effort | AGENTS.md review and patch draft (Task 6) | `app/AGENTS.md`, only after my approval; I applied the approved lines by hand, the chat could not edit files |
| Claude (claude.ai web chat, files attached) | Claude Haiku 5.5, low effort | refactor plan and minimal patch for R6 (Task 8); the first plan was rejected and the second diff approved | `app/src/utils/time.ts` (new) and `app/src/utils/availability.ts`, applied by hand; the R1 mitigation is the same `AGENTS.md` patch as Task 6 |
| Claude (claude.ai chat, step-by-step lab guidance) | Claude Sonnet 5.5 | drafted worksheet text: setup, baseline, claims table, register, audit rows, decisions, residual-risk table, background-agent rules and a first draft of the §10 conclusion; wrote the R6 regression test and the exact `AGENTS.md` edits I applied; read my command output and files I pasted | `lab-report.md`, `app/src/booking.test.ts` (the R6 test), `app/AGENTS.md` (the edit text); I pasted or typed all of it myself |
| Claude (same chat) | Claude Sonnet 5.5 | helped me check results: I ran every command and test myself and pasted the real output, and the chat read it | none; it can't edit my files or run commands |

**The review in Task 2 ran in a mode where the assistant could not edit, and `git status` showed no
change afterwards:** yes
<!-- If it edited anything, say what and how you undid it. -->

**I labelled every claim in lab-report.md §3.2 after opening the cited file myself:** yes

**Every change to `app/` was reviewed by me as a diff before I accepted it:** yes
<!-- Name anything you rejected in §8; name here anything you accepted without reading. -->

**I used another assistant as well (to explain a risk, to draft text in lab-report.md, …):** no
<!-- If "yes": which one, the exact model, and for which section. -->

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes

**I can explain every score in my register, and why my release decision follows from it, without
the assistant:** yes

**Anything I accepted from the AI without fully understanding it:**
<!-- Name the file and the part. An honest entry here costs far less than a blank one that turns out to be untrue. -->

Signed: Guchshin Artem
Date: 2026-11-21
