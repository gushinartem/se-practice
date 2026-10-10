# SIS #01 — Software Engineering Fundamentals, With an AI in the Loop

<!--
  This is the only file you write your report in. README.md tells you what goes where.

  Rules the checker relies on:
  - Do not delete, rename or renumber the ## headings, the ### headings, or the **Label:** words.
  - Replace every "(write here)" and "(paste here)". None may be left when you submit.
  - Comments like this one are ignored by the word counter. Delete them or leave them.
-->

**Topic:** 1.3 Software engineering and cost

<!-- Exactly one of 1.1 … 1.10, e.g.  **Topic:** 1.4  -->

---

## 1. Scenario

<!-- 100–150 words, labels included. One small scenario, used in every prompt and in your
     whole answer. Anything fictional is labelled in Assumptions. -->

**Question:** Does faster AI code generation reduce the total lifetime cost of a small club registration app, and which enginneering methods keep the cost low?

**Users:** Club members and 2-3 organizers.

**Problem:** Registration is done in chats and spreadsheets,so people get lost.

**Constraints:** No budget , organisers change every semester.

**Risk:** AI-written code goes live without tests or documentation , and later nobody can fix it cheaply.

**Assumptions:** Fictional: 80 members , 2 developers , the app is used for 2+ years.

## 2. Analysis

<!-- 350–400 words. Your answer to the question, the trade-offs, and how it applies to your
     scenario. Explain at least two engineering decisions and why they fit the scenario. -->

(write here)

## 3. Review

<!-- 250–300 words. What Prompt B's critique said and what you did with it; your two source
     checks and your two substantive revisions, each with a reason. Point at the rows of the
     tables in section 9 ("verification row 2", "change-log row 1"). -->

(write here)

## 4. Conclusion

<!-- 100–150 words. Your recommendation for the scenario and its main limitation. -->

(write here)

## 5. Reflection

<!-- 150–200 words. NOT part of the main total. Written by you, not by the assistant:
     what helped, what you changed, what you learned. Specific beats flattering. -->

(write here)

## 6. References

<!-- Full references, one per line, each starting with "- ". Only sources you actually opened.
     Every URL used in the verification table must also appear here. Example:
     - Sommerville, I. (2016). Software Engineering, 10th ed., Global Edition. Pearson. Ch. 1.
-->

- https://cs.gmu.edu/~offutt/classes/437/maintessays/maintEvolutionOverview.html
- https://cs.ccsu.edu/~stan/classes/CS410/Notes16/09-SoftwareEvolution.html

## 7. Appendix A — Initial outline

<!-- Written BEFORE you run Prompt A. Five points, your own words, numbered. These are the
     "five points" you paste into Prompt A. -->

1. Writing the code is the first step. Fixing bugs and changing the app later can cost more than writing it.
2. Engineering mathods could save much money on long way.
3. In a case with fixing bugs on working app , AI wouldn't fix anything
4. AI writes it without any documentation so it would be very hard when some bug will appear.
5. AI should be controlled by human , not get all the responsiblity.

## 8. Appendix B — AI exchanges

<!-- Complete prompts and complete responses, as text — never screenshots. Paste each inside
     the fenced block that follows its label. If a response itself contains ``` lines, open
     and close that block with ~~~~ instead. You may add B4, B5 … after B3 if you ran more. -->

### B1 — Draft (Prompt A)

- **Tool:** Claude
- **Model:** Sonnet 5.5 medium
- **Date:** 10.10.2026
- **Purpose:** contextual draft

<!-- Model: the exact model with its version, as the tool shows it (e.g. "GPT-5 Thinking",
     "Claude Sonnet 4.5"). If the tool does not show it, write: not displayed
     Date: YYYY-MM-DD -->

**Prompt:**

```text
Act as a software engineering tutor. Help me analyze topic" Does faster AI code generation reduce the total lifetime cost of a small club registration app, and which enginneering methods keep the cost low?" for a first-year-level university assignment.

My scenario is - users : Club members and 2-3 organizers ; problem : Registration is done in chats and spreadsheets , so people get lost ; Contrainst: No budget , orgnisers change every semester; Risk : AI -written code goes live without test or documentation , and later nobody can fix it cheaply; Assumptions : Fictional: 80 members , 2 developers , the app is used for 2+ years. My initial ideas are 1.Writing the code is the first step. Fixing bugs and changing the app later can cost more than writing it; 2.Enginnering methods could save much money on long way;3. In a cast with fixing bugs on working app, AI wouldn't fix anything ; 4. AI writes it without any documentaiton so it would be very hard when some bug will appear;5.AI should be controlled by human , not get all the responsiblity. Draft a 400–500 word explanation using these details.

Separate facts from assumptions. Explain trade-offs and identify claims I should verify. Do not invent quotations, references or page numbers.
```

**Response:**

```text
# Does Faster AI Code Generation Reduce the Lifetime Cost of a Club Registration App?

*(Draft, about 470 words)*

**Short answer:** Faster code generation lowers only the first, smallest part of the cost. Whether total lifetime cost falls depends on the engineering methods around the AI-written code.

## Scenario and assumptions

This analysis uses a fictional setup: 80 members, 2 developers, 2-3 organizers, no budget, and an app used for 2+ years. Organizers change every semester, so knowledge leaves the club regularly. These numbers are assumptions, not data, and the conclusions are only as strong as they are.

## What is generally accepted

Software engineering textbooks commonly treat maintenance (fixing bugs, adapting to new needs) as a large share of total lifetime cost, often larger than initial development. Your first idea reflects this. Writing code is the first step, not the whole cost. In this scenario, a semester handover makes maintenance harder, because the new organizers did not build the app.

## Where AI helps and where it does not

AI can reduce the *initial* writing time for a simple app like this. But it does not remove the later costs: understanding the code, testing changes, and fixing bugs. Your risk scenario is the key one. If AI-written code goes live without tests or documentation, a bug in semester three may cost more to fix than the code cost to create. Nobody understands the code, and nothing shows whether a fix breaks something else.

I would soften your third idea ("AI wouldn't fix anything"). AI *can* help debug, but it needs context: the code, the error, and ideally tests. Without documentation and tests, its suggestions are harder to check. So the issue is less "AI cannot fix" and more "AI fixes are risky when nobody can verify them."

## Engineering methods that keep cost low

- **Automated tests** for core flows (register, cancel, list attendees) catch regressions cheaply.
- **Documentation** (a short README, setup steps, a data description) lets new organizers take over.
- **Code review** by a human before anything goes live.
- **Version control**, so bad changes can be undone.
- **Simple design and few dependencies**, since this app needs little.

These cost time upfront but are cheap compared with an emergency fix by someone who does not understand the app.

## Trade-offs

Tests and documentation slow the first release, which may feel wasteful for a club with no budget. The saving only appears if the app really lives 2+ years and changes hands. If it were used for one event, skipping them might be rational. Human review also costs scarce volunteer time.

## Your conclusion

Faster generation reduces lifetime cost *only if* humans stay responsible for review, tests, and documentation (your idea 5). Used alone, it may shift cost from writing to maintenance.

## Claims to verify

1. What share of lifetime cost maintenance represents. Find this in your course textbook or a cited study, and quote the figure only from a source you have read.
2. Whether AI-generated code has measurably more or fewer defects than human-written code. Studies exist, but results vary, so check recent sources.
3. Whether tests and documentation demonstrably reduce maintenance cost in small projects.
4. Whether AI actually shortens total development time, or merely initial typing time.

I have not cited any sources, so you will need to find and reference them yourself.

*Note: your list is a good start. For the assignment, tie each idea to evidence, and say clearly which statements are assumptions about your fictional scenario.*
```

### B2 — Critique (Prompt B)

- **Tool:** Claude
- **Model:** Sonnet 5.5 medium
- **Date:** 10.10.26
- **Purpose:** critical review of the draft

**Prompt:**

```text
Review the draft below against my chosen question and scenario. Identify inaccuracies, missing reasoning, vague claims and unsupported assumptions.
For each concern, explain why it matters and how I could check it. Include a counterexample or alternative interpretation. Do not rewrite the answer yet.
Question: Does faster AI code generation reduce the total lifetime cost of a small club registration app, and which enginneering methods keep the cost low?. Scenario:**Users:** Club members and 2-3 organizers.

**Problem:** Registration is done in chats and spreadsheets,so people get lost.

**Constraints:** No budget , organisers change every semester.

**Risk:** AI-written code goes live without tests or documentation , and later nobody can fix it cheaply.

**Assumptions:** Fictional: 80 members , 2 developers , the app is used for 2+ years.
 . Draft: # Does Faster AI Code Generation Reduce the Lifetime Cost of a Club Registration App?

*(Draft, about 470 words)*

**Short answer:** Faster code generation lowers only the first, smallest part of the cost. Whether total lifetime cost falls depends on the engineering methods around the AI-written code.

## Scenario and assumptions

This analysis uses a fictional setup: 80 members, 2 developers, 2-3 organizers, no budget, and an app used for 2+ years. Organizers change every semester, so knowledge leaves the club regularly. These numbers are assumptions, not data, and the conclusions are only as strong as they are.

## What is generally accepted

Software engineering textbooks commonly treat maintenance (fixing bugs, adapting to new needs) as a large share of total lifetime cost, often larger than initial development. Your first idea reflects this. Writing code is the first step, not the whole cost. In this scenario, a semester handover makes maintenance harder, because the new organizers did not build the app.

## Where AI helps and where it does not

AI can reduce the *initial* writing time for a simple app like this. But it does not remove the later costs: understanding the code, testing changes, and fixing bugs. Your risk scenario is the key one. If AI-written code goes live without tests or documentation, a bug in semester three may cost more to fix than the code cost to create. Nobody understands the code, and nothing shows whether a fix breaks something else.

I would soften your third idea ("AI wouldn't fix anything"). AI *can* help debug, but it needs context: the code, the error, and ideally tests. Without documentation and tests, its suggestions are harder to check. So the issue is less "AI cannot fix" and more "AI fixes are risky when nobody can verify them."

## Engineering methods that keep cost low

- **Automated tests** for core flows (register, cancel, list attendees) catch regressions cheaply.
- **Documentation** (a short README, setup steps, a data description) lets new organizers take over.
- **Code review** by a human before anything goes live.
- **Version control**, so bad changes can be undone.
- **Simple design and few dependencies**, since this app needs little.

These cost time upfront but are cheap compared with an emergency fix by someone who does not understand the app.

## Trade-offs

Tests and documentation slow the first release, which may feel wasteful for a club with no budget. The saving only appears if the app really lives 2+ years and changes hands. If it were used for one event, skipping them might be rational. Human review also costs scarce volunteer time.

## Your conclusion

Faster generation reduces lifetime cost *only if* humans stay responsible for review, tests, and documentation (your idea 5). Used alone, it may shift cost from writing to maintenance.

## Claims to verify

1. What share of lifetime cost maintenance represents. Find this in your course textbook or a cited study, and quote the figure only from a source you have read.
2. Whether AI-generated code has measurably more or fewer defects than human-written code. Studies exist, but results vary, so check recent sources.
3. Whether tests and documentation demonstrably reduce maintenance cost in small projects.
4. Whether AI actually shortens total development time, or merely initial typing time.

I have not cited any sources, so you will need to find and reference them yourself.

*Note: your list is a good start. For the assignment, tie each idea to evidence, and say clearly which statements are assumptions about your fictional scenario.*.
```

**Response:**

```text
# Critical Review of the Draft

Below, each concern has: what the problem is, why it matters, how to check it, and a counterexample or alternative reading. I have not rewritten anything. I also include concerns about my own earlier draft, since you asked me to review it against your question.

---

## A. Inaccuracies and overstated claims

**1. "Lowers only the first, smallest part of the cost" (Short answer)**
- *Problem:* This asserts that initial development is the smallest cost phase. That is stated as fact in the opening line but is never demonstrated. The body only says maintenance is "often larger."
- *Why it matters:* The whole argument hangs on this ranking. If it is wrong for this app, the conclusion weakens.
- *How to check:* Look for what your course textbook says about lifecycle cost distribution, and note whether the figures come from large or long-lived systems.
- *Counterexample:* A 200-line registration form that changes twice a year may have almost no maintenance. Initial build could be the largest cost. Alternative reading: "smallest" is true for big systems and unproven for tiny ones.

**2. "Software engineering textbooks commonly treat maintenance as a large share... often larger than initial development" (Accepted section)**
- *Problem:* This is a recollection of a general claim, not a verified one. Also, "maintenance" in the literature often includes new features and adaptation, not just bug fixing, yet the draft equates it with bug fixing.
- *Why it matters:* If most "maintenance" in the studies is feature enhancement, it does not support a point about fixing bugs in an unchanged app.
- *How to check:* Read how your textbook defines maintenance (corrective, adaptive, perfective, preventive) and whether any figure is attributed to a specific study.
- *Counterexample:* A club app may need no new features after launch. Then "maintenance" would be mostly corrective, and the typical percentages might not transfer.

**3. "A bug in semester three may cost more to fix than the code cost to create"**
- *Problem:* This is plausible but unsupported, and it is a specific prediction presented without reasoning about the app's size. Also, with 2 developers and 2+ years, "semester three" is arbitrary.
- *Why it matters:* If creation cost is a few hours of AI prompting, almost any fix could exceed it, which makes the comparison trivially true and less informative.
- *How to check:* Build a rough cost model with stated hours (see section D).
- *Counterexample:* If code is cheap to regenerate, the cheapest "fix" might be to replace the module rather than debug it, so the claim may fail.

**4. "Nobody understands the code" (Where AI helps)**
- *Problem:* Overstated. The two developers likely read the code during review, and AI itself can explain code. "Nobody" is true only after handover with no documentation.
- *Why it matters:* It conflates two different failure modes: code never understood, and code understood but forgotten after turnover.
- *How to check:* Separate the two in your scenario: who reviewed it, and who inherits it.
- *Alternative interpretation:* Understanding loss is a turnover problem, not an AI problem. Human-written code without documentation fails the same way. The draft does not show that AI makes this worse.

---

## B. Missing reasoning

**5. The central comparison is absent: AI versus no-AI**
- *Problem:* The question asks whether *faster AI generation* reduces cost. The draft never compares against a baseline (human-written code, or the existing chat-and-spreadsheet process).
- *Why it matters:* "Reduces cost" is relative. Without a baseline, the conclusion "only if humans stay responsible" is true of any code, AI or not.
- *How to check:* Define two or three scenarios (human-written, AI with no controls, AI with controls) and estimate or reason about each cost category.
- *Counterexample:* The spreadsheet process may have ongoing hidden costs (lost registrations, organizer time) that exceed any app maintenance cost. Then even a poorly maintained app could be cheaper overall.

**6. No definition of "total lifetime cost"**
- *Problem:* Cost is never defined. It could mean developer hours, organizer time, money, risk of failed events, or opportunity cost.
- *Why it matters:* With "no budget," money is zero, so cost must be measured in volunteer time or risk. The draft does not say which.
- *How to check:* State your unit explicitly (for example, person-hours over 2 years).
- *Alternative interpretation:* The most important cost might be a failed registration at a key event, which is a reliability cost, not an effort cost.

**7. The mechanism linking "faster generation" to maintenance cost is thin**
- *Problem:* The draft says cost "shifts" to maintenance but does not explain why. A plausible mechanism exists (more code produced than understood, less design thought), but it is not stated.
- *Why it matters:* An assignment needs a causal argument, not an assertion.
- *How to check:* Look for literature or course material on code understanding, technical debt, or review effort. Test the mechanism against your scenario.
- *Counterexample:* Speed could also free time for tests and documentation, so faster generation might *improve* maintainability. The draft treats speed and quality as opposed without arguing it.

**8. Engineering methods are listed, not justified or ranked**
- *Problem:* Five methods appear with a one-line benefit each. No reasoning about which gives the most value for an 80-member app, or what each costs.
- *Why it matters:* The question asks which methods keep cost low. A flat list does not answer "which."
- *How to check:* For each method, estimate effort and failure it prevents. Rank them.
- *Counterexample:* For a tiny app, extensive automated tests might cost more than they save, while a README and version control might capture most of the benefit. Ranking could differ sharply from the draft's order.

**9. "Cheap compared with an emergency fix" is unquantified**
- *Problem:* A comparison with no numbers or even a rough ratio.
- *Why it matters:* This is the crux of the trade-off, and it is asserted.
- *How to check:* Use hypothetical hours (clearly labeled as assumptions) and show break-even logic.

---

## C. Vague claims

**10. "Simple design and few dependencies"** is vague. Simple by what measure? Also, dependencies reduce code written, so fewer dependencies can mean more custom code to maintain. Check this trade-off; it may cut the other way.

**11. "Code review by a human"** does not say by whom, how long, or what they check. With changing organizers and 2 developers, reviewer competence and availability are real constraints.

**12. "Documentation"** is listed without saying what must be in it. A README nobody updates becomes wrong, and wrong documentation can cost more than none. Alternative: documentation kept short and tied to the code (for example, comments or tests that act as documentation).

**13. "AI can help debug"** is acknowledged but not bounded. Under what conditions does it work? The draft does not say.

---

## D. Unsupported assumptions

**14. Numbers in the scenario are used but not connected to the argument.**
- *Problem:* 80 members and 2 developers appear in the assumptions, yet nothing in the reasoning depends on them. That makes them decorative.
- *Why it matters:* Assumptions should drive conclusions. If you changed 80 to 8,000, would any statement change?
- *How to check:* For each assumption, ask what would change if it were different. If nothing, either use it or drop it.

**15. "2 developers" and "organizers change every semester" interact in an unexamined way.** Are the developers also organizers? If the developers persist while organizers rotate, the handover problem differs from the draft's description. If developers rotate too, it is worse. The draft assumes the worst case without saying so.

**16. "No budget" is not used.** It implies free hosting and free tools, which constrain which engineering methods are possible (for example, free CI tools may or may not suffice). Check what free tiers can support, and whether hosting itself becomes a recurring failure point.

**17. The "AI goes live without tests or documentation" risk is treated as inevitable.** It is a risk in your scenario, but the draft treats it as the default outcome. *Alternative:* a first-year club with two developers may well review code manually, which partly mitigates it. The probability matters and is not assessed.

---

## E. Structural and process concerns

**18. Separation of facts and assumptions is incomplete.** The "generally accepted" section mixes a recalled claim with a scenario-specific inference ("In this scenario, a semester handover makes maintenance harder"). The second is reasoning, not an accepted fact. Label each statement as fact, assumption, or inference.

**19. The conclusion largely restates the premise.** "Reduces cost only if humans stay responsible" is close to your idea 5 and is hard to disprove. A stronger conclusion would state conditions and rough thresholds.

**20. Idea 3 was softened, but idea 2 ("engineering methods could save much money") was accepted without challenge.** "Much money" is unsupported, and in a no-budget setting no money is saved or spent. This is a wording issue that could undermine credibility.

**21. Word count and the "Claims to verify" list.** Item 4 is phrased well, but the list omits a claim the draft depends on most: that review, tests, and documentation are *affordable* for volunteers.

---

## Priority order for revision (when you are ready)

1. Define "cost" and add a baseline comparison (concerns 5, 6).
2. Replace unsupported ranking claims with reasoned, labeled assumptions (1, 2, 3).
3. Justify and rank the engineering methods (8, 9, 10-12).
4. Make the scenario numbers actually drive the argument (14-16).

Tell me when you want a rewrite, or if you would like to work through one of these first, such as building a small hypothetical cost model.
```

### B3 — Revision (Prompt C)

- **Tool:** Claude
- **Model:** Sonnet 5.5 medium
- **Date:** 10.10.2026
- **Purpose:** revision using my decisions and verified evidence

**Prompt:**

```text
Revise the draft using my review decisions and source notes below. Keep the answer relevant to my scenario and preserve uncertainty where evidence is limited.
My decisions:
1 Lowers only the first , smallest part of the cost - qualify - it depends on the scale of app
2 Software engineering textbooks commonly traet maintenance as alarge share ... often larger than intial development - reject - in any app the maintenance would e cost , it just depends on the range of time taht this ap is exist
3 A bug in semester three may cost more to fix than the code cost to create - qualify - I"m agree with a part hat says abotu aonly bugs, abut there would be problems that are larger and more complex
4 Nobody undersands the code - accpet - I absolutely agree with this
5 The central comparison is absent: AI versus no-AI - accept - agree with it
6 No definition of "total lifetime cost" - qualify - cost I think is the effort cost too
7 The mechanism linking "faster generaiton" to maintenance cost is thin - reject - in the draft is clearly epxlained
8 Engineering methods are listed , not justfied or ranked - rjrect - why they sould be rnaked?
9 Cheap compared with an emergency fix" is unquantified - rject - why it should be unquantified
10 Simple design anfd few dependencies - reject
11 Code review by a human - reject
12 "Documentation" - accept
13Ai can help debug - reject
14 Numbers in teh scenrio are used but not connected to the argument- accept
15 "2 devlopers" and "organizers change every semester" interact in an unexamined way - reject
16 "No budget" is not used - reject
17 The "AI goes live without tests or documentation - reject
18 Separation of facs and assumptions is incomplete - reject
19 The conclusion largely restates the premise - reject
20 Idae 3 was softened but idea 2 wass accepted - reject
21 Word count and the "Claims to verify" - reject
. Verified evidence: 
1 Software engineering textbooks commonly treat maintenance (fixing bugs, adapting to new needs) as a large share of total lifetime cost, often larger than initial development. | https://cs.ccsu.edu/~stan/classes/CS410/Notes16/09-SoftwareEvolution.html | it says that maintenance is commonly larger | accept
2 In this scenario, a semester handover makes maintenance harder, because the new organizers did not build the app. | https://cs.gmu.edu/~offutt/classes/437/maintessays/maintEvolutionOverview.html | it says about initial programmer could resolve problems more faster and better | accept
. Draft: Does Faster AI Code Generation Reduce the Lifetime Cost of a Club Registration App?
(Draft, about 470 words)
Short answer: Faster code generation lowers only the first, smallest part of the cost. Whether total lifetime cost falls depends on the engineering methods around the AI-written code.
Scenario and assumptions
This analysis uses a fictional setup: 80 members, 2 developers, 2-3 organizers, no budget, and an app used for 2+ years. Organizers change every semester, so knowledge leaves the club regularly. These numbers are assumptions, not data, and the conclusions are only as strong as they are.
What is generally accepted
Software engineering textbooks commonly treat maintenance (fixing bugs, adapting to new needs) as a large share of total lifetime cost, often larger than initial development. Your first idea reflects this. Writing code is the first step, not the whole cost. In this scenario, a semester handover makes maintenance harder, because the new organizers did not build the app.
Where AI helps and where it does not
AI can reduce the initial writing time for a simple app like this. But it does not remove the later costs: understanding the code, testing changes, and fixing bugs. Your risk scenario is the key one. If AI-written code goes live without tests or documentation, a bug in semester three may cost more to fix than the code cost to create. Nobody understands the code, and nothing shows whether a fix breaks something else.
I would soften your third idea ("AI wouldn't fix anything"). AI can help debug, but it needs context: the code, the error, and ideally tests. Without documentation and tests, its suggestions are harder to check. So the issue is less "AI cannot fix" and more "AI fixes are risky when nobody can verify them."
Engineering methods that keep cost low

* Automated tests for core flows (register, cancel, list attendees) catch regressions cheaply.
* Documentation (a short README, setup steps, a data description) lets new organizers take over.
* Code review by a human before anything goes live.
* Version control, so bad changes can be undone.
* Simple design and few dependencies, since this app needs little.

These cost time upfront but are cheap compared with an emergency fix by someone who does not understand the app.
Trade-offs
Tests and documentation slow the first release, which may feel wasteful for a club with no budget. The saving only appears if the app really lives 2+ years and changes hands. If it were used for one event, skipping them might be rational. Human review also costs scarce volunteer time.
Your conclusion
Faster generation reduces lifetime cost only if humans stay responsible for review, tests, and documentation (your idea 5). Used alone, it may shift cost from writing to maintenance.
Claims to verify

1. What share of lifetime cost maintenance represents. Find this in your course textbook or a cited study, and quote the figure only from a source you have read.
2. Whether AI-generated code has measurably more or fewer defects than human-written code. Studies exist, but results vary, so check recent sources.
3. Whether tests and documentation demonstrably reduce maintenance cost in small projects.
4. Whether AI actually shortens total development time, or merely initial typing time.

I have not cited any sources, so you will need to find and reference them yourself.
Note: your list is a good start. For the assignment, tie each idea to evidence, and say clearly which statements are assumptions about your fictional scenario.
Show what you changed and why. Use only the sources I supplied. Flag remaining gaps instead of inventing details.
```

**Response:**

```text
# Revised Draft

**Does Faster AI Code Generation Reduce the Lifetime Cost of a Club Registration App?**

**Short answer:** Faster code generation lowers the cost of the first step, writing the code. For an app that lives long and changes hands, that step is likely a smaller part of total effort, but the proportion depends on the app's scale and lifespan. Whether total cost falls depends on the engineering methods around the AI-written code.

## Scenario and assumptions

This is a fictional setup: 80 members, 2 developers, 2-3 organizers, no budget, and an app used for 2+ years. Organizers change every semester. Assuming two semesters a year, that means at least four handovers. These are assumptions, not data, and each one shapes the argument:

- **80 members** means low load and a simple app, so the initial code is small. This is why "smallest part of the cost" cannot be assumed.
- **2 developers** means limited capacity for review and maintenance.
- **No budget** means cost is counted in volunteer effort, not money.

**Cost definition:** total lifetime cost here means effort (person-hours of developers and organizers over the app's life), including writing, understanding, testing, fixing, changing and handing over the code, as well as any money spent.

## What the sources support

Course notes on software evolution report that maintenance is commonly a larger share of lifetime cost than initial development (CCSU notes, https://cs.ccsu.edu/~stan/classes/CS410/Notes16/09-SoftwareEvolution.html). Reasoning of my own: the longer an app exists, the more maintenance effort accumulates, so lifespan matters. An overview of software maintenance indicates that the original programmer tends to resolve problems faster and better (GMU overview, https://cs.gmu.edu/~offutt/classes/437/maintessays/maintEvolutionOverview.html). **Inference, not a sourced fact:** since new organizers did not build the app, handovers likely make maintenance slower. Neither source addresses AI-written code.

## Comparing the alternatives

Three cases: (A) human-written code, (B) AI-written code with no controls, (C) AI-written code with tests, documentation and review. Compared with the current chat-and-spreadsheet process, which also has an unmeasured ongoing effort cost. **Assumption, unverified:** AI lowers initial writing effort in B and C versus A. B likely has the highest cost after handover. C gives back part of the saving through the effort spent on controls, so whether C beats A depends on whether the AI saving exceeds that effort. This is not established here.

## Where AI helps and where it does not

AI can reduce initial writing time for a simple app, but not the later costs of understanding, testing and fixing. In the risk scenario (AI code live without tests or documentation), simple bugs may stay cheap to fix. Larger problems, such as changes touching several parts of the app, could cost more than writing the code did. After a handover, nobody may understand the code, and nothing shows whether a fix breaks something else.

I would soften the idea that AI cannot fix anything. AI can help debug, but it needs context: the code, the error, and ideally tests. Without documentation and tests its suggestions are harder to check.

## Engineering methods that keep cost low

- **Automated tests** for core flows (register, cancel, list attendees).
- **Documentation:** a short README covering how to run the app, what data it stores, and known problems. It must be kept current, since outdated documentation can mislead.
- **Code review** by a human before anything goes live.
- **Version control**, so bad changes can be undone.
- **Simple design and few dependencies**, since this app needs little.

These cost time upfront but are cheap compared with an emergency fix by someone who does not understand the app.

## Trade-offs

Tests and documentation slow the first release, which may feel wasteful with no budget. The saving only appears if the app lives 2+ years and changes hands. For a single event, skipping them might be rational. Human review also costs scarce volunteer time.

## Conclusion

Faster generation reduces lifetime cost only if humans stay responsible for review, tests and documentation. Used alone, it may shift cost from writing to maintenance.

## Claims to verify

1. The size of the maintenance share. The CCSU notes say "commonly larger" but I have no figure from them, so do not quote a percentage.
2. Whether AI-generated code has more or fewer defects than human-written code.
3. Whether tests and documentation reduce maintenance cost in small projects.
4. Whether AI shortens total development time or only initial writing time.

Only the two sources above are cited, and neither covers AI.

---

# What I Changed and Why

| # | Decision | Change |
|---|---|---|
| 1 | Qualify | Short answer now says the share depends on scale and lifespan, and no longer asserts "smallest." |
| 2 | Reject | See conflict below. |
| 3 | Qualify | Separated simple bugs from larger, more complex problems. |
| 4 | Accept | Softened "nobody understands" to "after a handover, nobody may." See flag below. |
| 5 | Accept | Added the A/B/C comparison and the spreadsheet baseline. |
| 6 | Qualify | Added a cost definition based on effort. |
| 12 | Accept | Specified what the README contains and that it must stay current. |
| 14 | Accept | Tied 80, 2 and "no budget" to specific parts of the argument, and added the handover count. |
| Sources 1-2 | Accept | Added a "What the sources support" section. Retitled the old "generally accepted" section, and removed the claim that I had cited nothing. |
| 7-11, 13, 15-21 | Reject | Left unchanged. |

# Conflicts and Flags

1. **Decision 2 conflicts with your source note.** You rejected the maintenance sentence but accepted the CCSU source, which supports it. I kept the claim, now tied to the source, and added your point that lifespan drives the maintenance cost. If you want to reject it fully, you would need to drop the CCSU citation.
2. **Decision 4 is ambiguous.** "I absolutely agree with this" could mean you agree with the draft's sentence or with my concern that it was overstated. I applied the concern, which matches how you used "accept" elsewhere. Tell me if you want the original wording back.
3. **"Textbooks" changed.** Your source is course notes, not a textbook, so I no longer say "textbooks."
4. **I worked from your notes** about what each source says and did not open the pages. Confirm the paraphrases match them.
5. **Length:** the draft is now around 600 words, over your 400-500 target. The easiest cuts are the three bullets under "Scenario and assumptions" or the trade-offs section.
6. **Remaining gaps:** all AI-specific claims are unsourced. The A/B/C comparison is reasoning, not evidence. The draft still addresses "your" ideas in places, so adjust that for the final assignment.

On your questions: ranking methods isn't required, since the question asks "which methods," and a list that names them answers it. "Unquantified" meant no numbers, and I can't add any without sources, though you could add labeled hypothetical hours.
```

## 9. Appendix C — Evidence tables

### Verification table

<!-- At least two complete rows. Source and locator: title + page / slide / section / chapter,
     or title + URL + access date (YYYY-MM-DD). Decision: keep, qualify or reject — one word. -->

| AI claim | Source and locator | Evidence found | Decision |
| --- | --- | --- | --- |
| Software engineering textbooks commonly treat maintenance (fixing bugs, adapting to new needs) as a large share of total lifetime cost, often larger than initial development. | https://cs.ccsu.edu/~stan/classes/CS410/Notes16/09-SoftwareEvolution.html | it says that maintenance is commonly larger | accept   |
| In this scenario, a semester handover makes maintenance harder, because the new organizers did not build the app. | https://cs.gmu.edu/~offutt/classes/437/maintessays/maintEvolutionOverview.html | it says about initial programmer could resolve problems more faster and better | accept |

### Change log

<!-- At least two substantive revisions. Your final version must differ from the AI wording,
     and the reason must say which evidence or scenario constraint made you change it. -->

| AI wording / suggestion | Your final version | Reason for change |
| --- | --- | --- |
| “Faster code generation lowers only the first, smallest part of the cost.” | “AI-generated code lowers the cost of writing the app, but whether that is a small or large part of the total depends on how long the app lives and how often it changes. For a small app like this one, I cannot assume it is the smallest part.” | Verification row 1: the lecture notes on Sommerville ch. 9 say maintenance is usually greater than development, with a range that depends on the application, so “smallest” is not a safe claim. My scenario is a very small app (80 members), so the writing cost may not be small. |
| “In this scenario, a semester handover makes maintenance harder, because the new organizers did not build the app.” | “Source evidence says maintenance costs are higher when the original developers are not available. In my scenario, organizers change every semester, so I expect handovers to raise maintenance effort, but this is my inference and not a measured result for a club app.” | Verification row 2: the GMU overview supports the general point about team stability, but not the specific case of a club. So I split what the source says (general) from what I conclude (my scenario). This also matches my constraint that organizers change every semester. |
