marks = input()
valid_marks = 0
average = 0
highest = 0
lowest = 100
pass_marks = 0
sum_marks = 0
marks_strings = marks.split(", ")
marks_int = []
for x in marks_strings:
    try:
        marks_int.append(int(x))
    except ValueError:
        pass

for mark in marks_int:
    if 0 <= mark <= 100:
        valid_marks += 1
        if(mark >= 50):
            pass_marks += 1
        if mark > highest:
            highest = mark
        if mark < lowest:
            lowest = mark
        sum_marks += mark
if valid_marks > 0:
    print("Valid marks:", valid_marks)
    average = sum_marks / (len(marks_int) - (len(marks_int) - valid_marks))
    print(f"Average: {average:.2f}")
    print("Highest:", highest)
    print("Lowest:", lowest)
    print("Pass rate:", (pass_marks / valid_marks) * 100, "%")
else:
    print("No valid marks.")