import unittest
from booking import can_book


class BookingTests(unittest.TestCase):
    def test_touching_end_is_allowed(self):
        result = can_book(660, 720, 540, False, [(600, 660)])
        self.assertIs(result, True)
    def test_overlap(self):
        result = can_book(630, 690, 540, False, [(600, 660)])
        self.assertIs(result, False)
    def test_blocked(self):
        result = can_book(660, 720, 540, True, [(600, 660)])
        self.assertIs(result, False)
    def test_exactly_120_minutes(self):
        result = can_book(720, 840, 540, False, [(600, 660)])
        self.assertIs(result, True)
    def test_more_than_120_minutes(self):
        result = can_book(720, 841, 540, False, [(600, 660)])
        self.assertIs(result, False)
    def test_starts_now(self):
        result = can_book(540, 570, 540, False, [(600, 660)])
        self.assertIs(result, False)
    def test_zero_length_booking(self):
        result = can_book(600, 600, 540, False, [(600, 660)])
        self.assertIs(result, False)
    def test_reverse_order(self):
        result = can_book(720, 660, 540, False, [(600, 660)])
        self.assertIs(result, False)
    def test_start_after_the_end(self):
        result = can_book(1380, 1441, 540, False, [])
        self.assertIs(result, False)
    def test_empty_existing(self):
        result = can_book(660, 720, 540, False, [])
        self.assertIs(result, True)
    def test_existing_with_several_bookings(self):
        result = can_book(660, 720, 540, False, [(600, 630), (630, 660), (720, 750)])
        self.assertIs(result, True)
    def test_existing_input_is_unchanged(self):
        existing = [(720, 750), (600, 660)]
        original_existing = existing.copy()

        result = can_book(780, 800, 540, False, existing)

        self.assertIs(result, True)
        self.assertEqual(existing, original_existing)
    def test_booking_inside_existing(self):
        result = can_book(610, 620, 540, False, [(600, 660)])
        self.assertIs(result, False)
    def test_booking_contains_existing(self):
        result = can_book(590, 670, 540, False, [(600, 660)])
        self.assertIs(result, False)

    def test_overlap_with_second_booking(self):
        result = can_book(
            720, 780, 540, False,
            [(600, 660), (700, 760)]
        )
        self.assertIs(result, False)