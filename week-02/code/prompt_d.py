import sys


def analyze_marks(marks, pass_mark=50):
    if not marks:
        raise ValueError("marks list is empty")

    for m in marks:
        if isinstance(m, bool) or not isinstance(m, (int, float)):
            raise ValueError(f"non-numeric value: {m!r}")
        if not 0 <= m <= 100:
            raise ValueError(f"mark out of range (0-100): {m}")

    passed = sum(1 for m in marks if m >= pass_mark)
    return {
        "average": round(sum(marks) / len(marks), 2),
        "highest": max(marks),
        "lowest": min(marks),
        "pass_rate": round(passed / len(marks) * 100, 2),
    }


# ---------- tests ----------
def expect_error(marks):
    try:
        analyze_marks(marks)
    except ValueError:
        return
    raise AssertionError(f"ValueError not raised for {marks!r}")


def run_tests():
    # example from the task
    assert analyze_marks([40, 60, 80], 50) == {
        "average": 60, "highest": 80, "lowest": 40, "pass_rate": 66.67}
    # one mark
    assert analyze_marks([70]) == {
        "average": 70, "highest": 70, "lowest": 70, "pass_rate": 100.0}
    # decimals
    assert analyze_marks([49.5, 50.5, 75.25]) == {
        "average": 58.42, "highest": 75.25, "lowest": 49.5, "pass_rate": 66.67}
    # custom pass_mark
    assert analyze_marks([40, 60, 80], 70)["pass_rate"] == 33.33
    # empty list
    expect_error([])
    # text value
    expect_error([50, "abc"])
    # below 0 / above 100
    expect_error([-1, 50])
    expect_error([50, 100.5])
    print("All tests passed.")


# ---------- console ----------
def to_number(token):
    try:
        return float(token)
    except ValueError:
        return token  # analyze_marks will reject it


def main():
    text = input("Enter marks (comma or space separated): ")
    marks = [to_number(t) for t in text.replace(",", " ").split()]
    pass_text = input("Pass mark [50]: ").strip()
    pass_mark = float(pass_text) if pass_text else 50

    try:
        result = analyze_marks(marks, pass_mark)
    except ValueError as e:
        print("Error:", e)
        return

    print(f"Average:   {result['average']}")
    print(f"Highest:   {result['highest']}")
    print(f"Lowest:    {result['lowest']}")
    print(f"Pass rate: {result['pass_rate']}%")


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "test":
        run_tests()
    else:
        main()