# Lab report — Practice #02: The Prompt Is an Engineering Input

**Name: Artem Guchshin**
**Group: Monday 16:00-19:00**
**Date: 19.09.2026**

> Fill in every section. **Do not delete or renumber the headings** — the grading pass reads them
> by number. If something did not happen, write "did not happen" and why; an empty section and a
> fabricated one are graded the same way.

---

## 1. The frozen experiment

| | |
| --- | --- |
| AI assistant | Claude |
| Exact model name | Sonnet 5 medium |
| Implementation language | Python |
| Date of the runs | 19.09.2026 |

**Non-Python students only** — paste your substituted Prompt B text here, so the substitution can
be checked:

```
n/a
```

**Confirmations:**

- Each prompt was sent in a **fresh chat**: yes
- No follow-up questions were asked before Part 7: yes
- Every output was saved **before** any editing: yes

---

## 2. Prompt A — minimal

**Prompt sent** (should be exactly one sentence):

```
Write Pythong code to analyze student marks.
```

**Assumptions the AI made that I never gave it** — list them, one per line. A data format, a pass
threshold, a rounding rule, an input method, an invented feature all count.

1. It uses pandas for collecting data
2. Also it connected scv for analyzing student's data
3. It uses charts and graphs

**Questions it should have asked and did not:**

1. Didn't ask about format that i would enter in this program
2. Didn't ask about do i really need the csv support

**Is the function named `analyze_marks` with the required signature?** yes — if no, what is it
called:

**First impression before testing** (one sentence — you will compare this with section 6 later): It is very complex and heavy script that will calculate everything 

---

## 3. Prompt B — structured context

**Prompt sent** (paste it in full, including any substitutions):

```
You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return
average, highest, lowest, and pass_rate in a dictionary. Accept marks from 0 to 100;
raise ValueError for an empty list, non-numeric values, or out-of-range values. Use
no external libraries. Return code plus a short explanation.
```

**What B fixed compared to A:**

1. Nothing it just suppress the origin code
2. -

**What B still leaves open:**

1. A was perfect at the first prompt
2. Nothing it already covered all tasks

---

## 4. Prompt C — examples and tests

**What I appended to Prompt B:**

```
Example: analyze_marks([40, 60, 80], 50) → average 60, highest 80, lowest 40,
pass_rate 66.67. Include tests for: one mark, decimals, custom pass_mark, empty list,
text value, and marks below 0 or above 100. State any remaining assumptions before
the code.
```

**Tests the AI wrote for itself** — how many, and which situations do they cover?

| Situation | Covered by the AI's tests? |
| --- | --- |
| one mark | + |
| decimals | + |
| custom pass_mark | + |
| empty list | + |
| text value | + |
| below 0 / above 100 | + |

**Do the AI's own tests pass against the AI's own code?** yes

**Do they agree with the harness in section 6?** yes — if no, where do they disagree:

**Assumptions C stated explicitly before the code:-**

---

## 5. Prompt D — my combined prompt

**The complete prompt I wrote** (one message, sent to a fresh chat):

```
You are a Python developer. Implement analyze_marks(marks, pass_mark=50). Return
average, highest, lowest, and pass_rate in a dictionary. Accept marks from 0 to 100;
raise ValueError for an empty list, non-numeric values, or out-of-range values. Use
no external libraries. Return code plus a short explanation. Example: analyze_marks([40, 60, 80], 50) → average 60, highest 80, lowest 40,
pass_rate 66.67. Include tests for: one mark, decimals, custom pass_mark, empty list,
text value, and marks below 0 or above 100. State any remaining assumptions before
the code. Make it simple as you can , don't use any other libraries and do it that it could to work console input
```

**What I deliberately added that A, B and C did not have:**

1. Make it simple , all three times claude make it very complex
2. Typed to not use any other libaries
3. Make console input , not from file or somewhere.

**The ambiguity I found in the specification, and how I resolved it inside Prompt D: Is pass mark exclusive or not**

---

## 6. Test results — the evidence

Six cases × four prompts. Verdicts are **PASS**, **FAIL** or **ERROR** only.

| # | Call | Required | A | B | C | D |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 | | | | |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 | | | | |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | | | | |
| 4 | `analyze_marks([], 50)` | raises ValueError | | | | |
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError | | | | |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError | | | | |
| | **Totals** | | /6 | /6 | /6 | /6 |

**For every FAIL and ERROR above, one line: what was returned or raised instead.**

| Prompt | Case | What actually happened |
| --- | --- | --- |
|A | all | ERROR|
|B | all | PASS |
|C | all | FAIL |
|D | 1 | PASS |
|D | 2 | PASS |
|D | 3 | PASS |
|D | 4 | FAIL |
|D | 5 | FAIL |
|D | 6 | FAIL |

### Pasted terminal output — all four runs

> This is the part that makes the table above count. Paste the **whole** output, unedited,
> including the header lines. A table with nothing behind it is not accepted.

**Prompt A**

```
All are errors 
File "D:\se-practice\week-02\code\prompt_a.py", line 17, in <module>
    import numpy as np
ModuleNotFoundError: No module named 'numpy'
```

**Prompt B**

```
1. D:\se-practice\week-02\code>python prompt_b.py
{'average': 60.0, 'highest': 80, 'lowest': 40, 'pass_rate': 66.66666666666666}
2. D:\se-practice\week-02\code>python prompt_b.py
{'average': 100.0, 'highest': 100, 'lowest': 100, 'pass_rate': 100.0}
3.D:\se-practice\week-02\code>python prompt_b.py
{'average': 49.75, 'highest': 50, 'lowest': 49.5, 'pass_rate': 50.0}
4. D:\se-practice\week-02\code>python prompt_b.py
Traceback (most recent call last):
  File "D:\se-practice\week-02\code\prompt_b.py", line 22, in <module>
    print(analyze_marks([], 50))
          ~~~~~~~~~~~~~^^^^^^^^
  File "D:\se-practice\week-02\code\prompt_b.py", line 4, in analyze_marks
    raise ValueError("marks must not be empty")
ValueError: marks must not be empty
5. D:\se-practice\week-02\code>python prompt_b.py
Traceback (most recent call last):
  File "D:\se-practice\week-02\code\prompt_b.py", line 22, in <module>
    print(analyze_marks([40, "60"], 50))
          ~~~~~~~~~~~~~^^^^^^^^^^^^^^^^
  File "D:\se-practice\week-02\code\prompt_b.py", line 8, in analyze_marks
    raise ValueError(f"non-numeric mark: {m!r}")
ValueError: non-numeric mark: '60'
6. D:\se-practice\week-02\code>python prompt_b.py
Traceback (most recent call last):
  File "D:\se-practice\week-02\code\prompt_b.py", line 22, in <module>
    print(analyze_marks([-1,50,101], 50))
          ~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^
  File "D:\se-practice\week-02\code\prompt_b.py", line 10, in analyze_marks
    raise ValueError(f"mark out of range (0-100): {m!r}")
ValueError: mark out of range (0-100): -1
```

**Prompt C**

```
For all cases it just don't dipslay anything 
.................
----------------------------------------------------------------------
Ran 17 tests in 0.001s

OK
```

**Prompt D**

```
1. D:\se-practice\week-02\code>python prompt_d.py
Enter marks (comma or space separated): 40 60 80
Pass mark [50]: 50
Average:   60.0
Highest:   80.0
Lowest:    40.0
Pass rate: 66.67%
2. D:\se-practice\week-02\code>python prompt_d.py
Enter marks (comma or space separated): 100
Pass mark [50]: 50
Average:   100.0
Highest:   100.0
Lowest:    100.0
Pass rate: 100.0%
3. D:\se-practice\week-02\code>python prompt_d.py
Enter marks (comma or space separated): 49.5 50
Pass mark [50]: 50
Average:   49.75
Highest:   50.0
Lowest:    49.5
Pass rate: 50.0%
4. D:\se-practice\week-02\code>python prompt_d.py
Enter marks (comma or space separated):
Pass mark [50]: 50
Error: marks list is empty
5. D:\se-practice\week-02\code>python prompt_d.py
Enter marks (comma or space separated): 40 "60"
Pass mark [50]: 50
Error: non-numeric value: '"60"'
6. D:\se-practice\week-02\code>python prompt_d.py
Enter marks (comma or space separated): -1 50 101
Pass mark [50]: 50
Error: mark out of range (0-100): -1.0
```

---

## 7. Scoring

0–2 per criterion, using the rubric in `README.md` Part 7.

| Criterion | A | B | C | D |
| --- | --- | --- | --- | --- |
| Correctness (cases passed) | 6 | 6 | 6 | 6 |
| Requirement coverage | 5 | 6 | 2 | 6 |
| Verifiability (tests) | 0 | 6 | 6 | 3 |
| Assumptions stated | 4 | 4 | 4 | 4 |
| Noise (2 = none) | 0 | 6 | 2 | 4 |
| **Total / 10** | 15 | 28 | 20 | 23 |

**Prompt length, in words:** A _7_ · B _46_ · C _76_ · D _97_

**Words added per point gained** — B over A, C over B, D over C. One line on what that ratio says: B/A = 6,57 C/B = 1,65 D/C = 1,27

---

## 8. Conclusion — 150–200 words

Answer in this order: (1) which prompt scored best, and whether it is the one you would actually
use at work; (2) which single addition bought the most correctness, naming the exact case that
changed verdict; (3) what was pure noise; (4) the ambiguity and your resolution.

Name test cases and real returned values. "More detailed prompts work better" scores zero.

```
The best code was produced by my D prompt because of it correctness in the side of how it working and UX design solutions . But prompt B was the most matched for our limitations and resitrctions it finds all error that are needed but i don't know why in lab restriction there is raise ValueError restriction which is bad , every error that occuring we have to handle without raising the error there should be just one simple message about it not traceback and etc. I would actually worked with D .
My correctness that i added into prompt is not exactly matching the requirements of lab because as i said lab's prompt says to ai that it should write code that RAISE the error that shouldn't be in any program at all.
C prompt added some unnecessary unitest libarary and used it in code, it didn't do requirements well , because there wasn't input that i could enter . D was the best variation of this program without any noise or waste of lines of code
There wasn't any ambiguity , at least i didn't find it



```

**Word count: 183**

---

## 9. Two questions for the debrief

Written before class, answered in class.

1. Do many words in prompt will cause the best result ?
2. Should we use the max AI models for doing this easy tasks?
