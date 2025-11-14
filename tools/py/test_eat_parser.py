from pathlib import Path

from tools.py.eat_parser import parse_eat, stringify_eat


def test_round_trip_preserves_locked_boolean():
    fixture = Path("example/analyst_agent.eat").read_text(encoding="utf-8")

    parsed = parse_eat(fixture)
    assert parsed["locked"] is True
    assert parsed["rules"] == ["geen_hallucinaties", "brontransparantie"]

    round_tripped = stringify_eat(parsed)
    assert "locked: true" in round_tripped

    reparsed = parse_eat(round_tripped)
    assert reparsed["locked"] is True
    assert reparsed["rules"] == parsed["rules"]
