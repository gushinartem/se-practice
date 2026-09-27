"""
Student Marks Analyzer
----------------------
Usage:
    python analyze_marks.py                 # runs on built-in sample data
    python analyze_marks.py marks.csv       # runs on your own CSV

CSV format: one row per student, one column per subject, plus a "Name" column:
    Name,Math,Physics,English
    Alice,88,92,79
    Bob,54,61,70

Requires: pandas, matplotlib  (pip install pandas matplotlib)
"""

import sys
import numpy as np
import pandas as pd
import matplotlib

matplotlib.use("Agg")  # write charts to file; works without a display
import matplotlib.pyplot as plt

PASS_MARK = 40
AT_RISK_AVG = 50  # students averaging below this are flagged


# ---------- Data loading ----------
def load_data(path=None):
    """Load marks from CSV, or generate sample data if no path is given."""
    if path:
        df = pd.read_csv(path)
    else:
        rng = np.random.default_rng(42)
        names = ["Alice", "Bob", "Chen", "Dana", "Eli", "Farah", "Gus",
                 "Hana", "Ivan", "Jia", "Kofi", "Lena", "Mateo", "Nora", "Omar"]
        subjects = ["Math", "Physics", "Chemistry", "English", "History"]
        df = pd.DataFrame(
            rng.normal(68, 15, (len(names), len(subjects))).clip(0, 100).round(0),
            columns=subjects,
        )
        df.insert(0, "Name", names)

    df = df.set_index("Name")
    df = df.apply(pd.to_numeric, errors="coerce")  # bad entries become NaN
    if df.isna().any().any():
        print(f"Note: {int(df.isna().sum().sum())} missing/invalid mark(s) ignored.\n")
    return df


# ---------- Analysis ----------
def assign_grade(avg):
    if avg >= 90: return "A"
    if avg >= 80: return "B"
    if avg >= 70: return "C"
    if avg >= 60: return "D"
    if avg >= PASS_MARK: return "E"
    return "F"


def analyze(df):
    subjects = df.columns

    student = pd.DataFrame({
        "Total": df.sum(axis=1),
        "Average": df.mean(axis=1).round(2),
        "Highest": df.max(axis=1),
        "Lowest": df.min(axis=1),
    })
    student["Grade"] = student["Average"].apply(assign_grade)
    student["Rank"] = student["Average"].rank(ascending=False, method="min").astype(int)
    student = student.sort_values("Rank")

    subject = pd.DataFrame({
        "Mean": df.mean().round(2),
        "Median": df.median(),
        "Std Dev": df.std().round(2),
        "Min": df.min(),
        "Max": df.max(),
        "Pass Rate %": ((df >= PASS_MARK).sum() / df.count() * 100).round(1),
    })

    return student, subject


def print_report(df, student, subject):
    line = "=" * 60
    print(line, "\nSTUDENT MARKS REPORT\n" + line)
    print(f"Students: {len(df)}   Subjects: {len(df.columns)}")
    print(f"Class average: {student['Average'].mean():.2f}\n")

    print("--- Per-student results (ranked) ---")
    print(student.to_string(), "\n")

    print("--- Per-subject statistics ---")
    print(subject.to_string(), "\n")

    print("--- Grade distribution ---")
    dist = student["Grade"].value_counts().reindex(list("ABCDEF"), fill_value=0)
    print(dist.to_string(), "\n")

    print("--- Top 3 students ---")
    print(student.head(3)[["Average", "Grade"]].to_string(), "\n")

    print("--- Best / weakest subject (by mean) ---")
    print(f"Best:    {subject['Mean'].idxmax()} ({subject['Mean'].max()})")
    print(f"Weakest: {subject['Mean'].idxmin()} ({subject['Mean'].min()})\n")

    at_risk = student[student["Average"] < AT_RISK_AVG]
    print(f"--- At-risk students (average < {AT_RISK_AVG}) ---")
    print(at_risk[["Average", "Grade"]].to_string() if not at_risk.empty else "None", "\n")

    failed = (df < PASS_MARK)
    print(f"--- Students failing at least one subject (< {PASS_MARK}) ---")
    for name, row in failed.iterrows():
        if row.any():
            print(f"{name}: {', '.join(row[row].index)}")
    print()

    print("--- Subject correlation ---")
    print(df.corr().round(2).to_string(), "\n")


# ---------- Charts ----------
def make_charts(df, student, subject, out="marks_analysis.png"):
    fig, axes = plt.subplots(2, 2, figsize=(13, 9))

    # 1. Subject means with std-dev error bars
    axes[0, 0].bar(subject.index, subject["Mean"], yerr=subject["Std Dev"],
                   capsize=4, color="#4C78A8")
    axes[0, 0].set_title("Average Mark by Subject (± std dev)")
    axes[0, 0].set_ylim(0, 100)

    # 2. Distribution of student averages
    axes[0, 1].hist(student["Average"], bins=8, color="#59A14F", edgecolor="white")
    axes[0, 1].axvline(student["Average"].mean(), color="red", ls="--", label="Class mean")
    axes[0, 1].set_title("Distribution of Student Averages")
    axes[0, 1].legend()

    # 3. Box plot per subject
    axes[1, 0].boxplot([df[c].dropna() for c in df.columns])
    axes[1, 0].set_xticks(range(1, len(df.columns) + 1), df.columns)
    axes[1, 0].axhline(PASS_MARK, color="red", ls=":", label=f"Pass mark ({PASS_MARK})")
    axes[1, 0].set_title("Mark Spread by Subject")
    axes[1, 0].legend()

    # 4. Student averages, ranked
    s = student.sort_values("Average")
    colors = ["#E15759" if a < AT_RISK_AVG else "#4C78A8" for a in s["Average"]]
    axes[1, 1].barh(s.index, s["Average"], color=colors)
    axes[1, 1].set_title("Student Averages (red = at risk)")

    plt.tight_layout()
    plt.savefig(out, dpi=150)
    print(f"Chart saved to {out}")


# ---------- Main ----------
if __name__ == "__main__":
    path = sys.argv[1] if len(sys.argv) > 1 else None
    df = load_data(path)
    student, subject = analyze(df)
    print_report(df, student, subject)
    make_charts(df, student, subject)

    student.to_csv("student_summary.csv")
    subject.to_csv("subject_summary.csv")
    print("Saved student_summary.csv and subject_summary.csv")
