"""Analyze a list of marks: average, highest, lowest and pass rate."""

import math
import unittest


def _validate_number(value, name):
    """Return value if it is a real number in [0, 100]; otherwise raise ValueError."""
    # bool is a subclass of int, so it must be excluded explicitly.
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise ValueError(f"{name} must be a number, got {value!r}")
    if math.isnan(value) or not 0 <= value <= 100:
        raise ValueError(f"{name} must be between 0 and 100, got {value!r}")
    return value


def analyze_marks(marks, pass_mark=50):
    """Return a dict with average, highest, lowest and pass_rate for `marks`.

    - marks: non-empty list (or other iterable) of numbers from 0 to 100.
    - pass_mark: a mark counts as a pass if mark >= pass_mark (default 50).
    - average and pass_rate are rounded to 2 decimal places;
      pass_rate is a percentage (0-100).

    Raises ValueError for an empty list, non-numeric values, or values
    outside 0-100 (this also applies to pass_mark).
    """
    try:
        marks = list(marks)
    except TypeError:
        raise ValueError("marks must be a list of numbers") from None

    if not marks:
        raise ValueError("marks must not be empty")

    _validate_number(pass_mark, "pass_mark")
    for mark in marks:
        _validate_number(mark, "mark")

    passed = sum(1 for mark in marks if mark >= pass_mark)

    return {
        "average": round(sum(marks) / len(marks), 2),
        "highest": max(marks),
        "lowest": min(marks),
        "pass_rate": round(passed / len(marks) * 100, 2),
    }


class TestAnalyzeMarks(unittest.TestCase):
    def test_example_from_spec(self):
        self.assertEqual(
            analyze_marks([40, 60, 80], 50),
            {"average": 60, "highest": 80, "lowest": 40, "pass_rate": 66.67},
        )

    def test_one_mark_passing(self):
        self.assertEqual(
            analyze_marks([75]),
            {"average": 75, "highest": 75, "lowest": 75, "pass_rate": 100.0},
        )

    def test_one_mark_failing(self):
        self.assertEqual(
            analyze_marks([30]),
            {"average": 30, "highest": 30, "lowest": 30, "pass_rate": 0.0},
        )

    def test_decimals(self):
        result = analyze_marks([70.5, 80.25, 60.0])
        self.assertEqual(result["average"], 70.25)
        self.assertEqual(result["highest"], 80.25)
        self.assertEqual(result["lowest"], 60.0)
        self.assertEqual(result["pass_rate"], 100.0)

    def test_average_is_rounded_to_two_places(self):
        self.assertEqual(analyze_marks([10, 10, 11])["average"], 10.33)

    def test_custom_pass_mark(self):
        marks = [40, 60, 80]
        self.assertEqual(analyze_marks(marks, 70)["pass_rate"], 33.33)
        self.assertEqual(analyze_marks(marks, 30)["pass_rate"], 100.0)
        self.assertEqual(analyze_marks(marks, 90)["pass_rate"], 0.0)

    def test_mark_equal_to_pass_mark_passes(self):
        self.assertEqual(analyze_marks([50, 49.9])["pass_rate"], 50.0)

    def test_boundaries_0_and_100_accepted(self):
        result = analyze_marks([0, 100])
        self.assertEqual(result["lowest"], 0)
        self.assertEqual(result["highest"], 100)
        self.assertEqual(result["average"], 50)

    def test_empty_list(self):
        with self.assertRaises(ValueError):
            analyze_marks([])

    def test_text_value(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, "abc", 70])

    def test_numeric_string_rejected(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, "80"])

    def test_none_and_bool_rejected(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, None])
        with self.assertRaises(ValueError):
            analyze_marks([50, True])

    def test_below_zero(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, -1])

    def test_above_100(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, 100.1])
        with self.assertRaises(ValueError):
            analyze_marks([101])

    def test_nan_and_inf_rejected(self):
        with self.assertRaises(ValueError):
            analyze_marks([50, float("nan")])
        with self.assertRaises(ValueError):
            analyze_marks([50, float("inf")])

    def test_invalid_pass_mark(self):
        with self.assertRaises(ValueError):
            analyze_marks([50], pass_mark=150)
        with self.assertRaises(ValueError):
            analyze_marks([50], pass_mark="fifty")

    def test_input_not_iterable(self):
        with self.assertRaises(ValueError):
            analyze_marks(None)


if __name__ == "__main__":
    unittest.main()