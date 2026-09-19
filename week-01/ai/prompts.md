question #1:
    How will marks be entered into the app ?
        1 . Type them in manually
        2 . Paste a list of numbers
        3 . Upload a CSV or spreadsheet


Rocket enhanced prompt:
    A lightweight, open-access web tool where anyone can paste a list of student marks and instantly see the class average, highest mark, lowest mark, and pass rate — no login required. Clean, simple, and built for quick results.

    Building with Next.js and TypeScript.


            Test Cases
A : 85, 23, 45, 90, 92  +
    avg - 67
    pass rate - 60%
    highest - 92
    lowerst - 23
    passed - 3
    failed - 2

B : 88, 47, -5, 101, abc, 73, 50, , 100 + 
    avg - 71.60
    pass rate - 80%
    highest - 100
    lowest - 47
    passed - 4
    failed - 1
C : 10, 20, 30 +
    avg - 20
    pass rate - 0
    highest - 30
    lowest - 10
    passed - 0
    failed - 2
D : abc, , xyz +
    just a message - "No valid marks found"

!!!!!All test cases are valid there is no need in additional prompt!!!!!