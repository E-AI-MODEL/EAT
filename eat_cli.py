"""eat_cli.py
CLI tool for EAT <-> JSON conversion.

Usage:
  python eat_cli.py parse file.eat
  python eat_cli.py stringify file.json
"""
import sys
import json
from pathlib import Path
from eat_parser import parse_eat, stringify_eat


def main() -> None:
    if len(sys.argv) != 3:
        print(__doc__)
        raise SystemExit(1)

    cmd, file = sys.argv[1], Path(sys.argv[2])
    if not file.exists():
        print(f"File not found: {file}")
        raise SystemExit(1)

    if cmd == "parse":
        text = file.read_text(encoding="utf-8")
        doc = parse_eat(text)
        print(json.dumps(doc, indent=2, ensure_ascii=False))
    elif cmd == "stringify":
        text = file.read_text(encoding="utf-8")
        data = json.loads(text)
        eat_text = stringify_eat(data)
        print(eat_text, end="")
    else:
        print(__doc__)
        raise SystemExit(1)


if __name__ == "__main__":
    main()
