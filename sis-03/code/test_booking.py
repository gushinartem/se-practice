
import unittest

from booking import can_book

# Base data from the brief: now = 540 (09:00), room not blocked, one booking 600-660.
NOW = 540
EXISTING = [(600, 660)]


def check(start, end, now=NOW, blocked=False, existing=None):
    return can_book(start, end, now, blocked, EXISTING if existing is None else existing)


class TestCanBook(unittest.TestCase):
    # Expected values come from AC1-AC5, not from running the code.

    def test_t1_touching_endpoint_is_allowed(self):       # AC4
        self.assertTrue(check(660, 720))

    def test_touching_the_start_of_a_booking_is_allowed(self):   # AC4
        self.assertTrue(can_book(540, 600, 500, False, EXISTING))

    def test_t2_overlap_is_rejected(self):                # AC4
        self.assertFalse(check(630, 690))

    def test_request_inside_a_booking_is_rejected(self):  # AC4
        self.assertFalse(check(610, 640))

    def test_t3_blocked_room_rejects_a_valid_request(self):   # AC3
        self.assertFalse(check(660, 720, blocked=True))

    def test_t4_exactly_120_minutes_is_allowed(self):     # AC2
        self.assertTrue(check(720, 840))

    def test_t5_121_minutes_is_rejected(self):            # AC2
        self.assertFalse(check(720, 841))

    def test_t6_starting_exactly_now_is_rejected(self):   # AC1
        self.assertFalse(check(540, 570))

    def test_starting_one_minute_after_now_is_allowed(self):  # AC1
        self.assertTrue(check(541, 571))

    def test_start_before_now_is_rejected(self):          # AC1
        self.assertFalse(check(500, 530))

    def test_t7_reversed_times_are_rejected(self):        # AC1
        self.assertFalse(check(720, 660))

    def test_equal_start_and_end_is_rejected(self):       # AC1
        self.assertFalse(check(720, 720))

    def test_t8_ending_exactly_at_midnight_is_allowed(self):  # AC1
        self.assertTrue(check(1380, 1440))

    def test_t9_ending_after_midnight_is_rejected(self):  # AC1
        self.assertFalse(check(1380, 1441))

    def test_negative_start_is_rejected(self):            # AC1 (0 <= start); now=-5 only isolates this bound
        self.assertFalse(can_book(-3, 10, -5, False, []))

    def test_t10_second_of_several_bookings_is_checked(self):  # AC4
        existing = [(600, 660), (700, 760)]
        self.assertFalse(can_book(720, 780, NOW, False, existing))

    def test_gap_between_two_bookings_is_allowed(self):   # AC4
        existing = [(600, 660), (700, 760)]
        self.assertTrue(can_book(660, 700, NOW, False, existing))

    def test_no_existing_bookings_is_allowed(self):       # AC1-AC4
        self.assertTrue(check(660, 720, existing=[]))

    def test_t11_existing_is_not_changed_and_result_is_stable(self):  # AC5
        existing = [(800, 860), (600, 660)]   # deliberately unsorted
        snapshot = list(existing)
        first = can_book(660, 720, NOW, False, existing)
        second = can_book(660, 720, NOW, False, existing)
        self.assertTrue(first)
        self.assertTrue(second)
        self.assertEqual(existing, snapshot)


if __name__ == "__main__":
    unittest.main()
