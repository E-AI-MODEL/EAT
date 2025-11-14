import unittest

from eat_parser import parse_eat


class ParseEatTests(unittest.TestCase):
    def test_description_block_uses_existing_current_block(self) -> None:
        text = (
            "description:\n"
            '"""\n'
            "Dit is regel 1\n"
            "Dit is regel 2\n"
            '"""\n'
        )
        doc = parse_eat(text)
        self.assertEqual(doc["description"], "Dit is regel 1\nDit is regel 2")


if __name__ == "__main__":
    unittest.main()
