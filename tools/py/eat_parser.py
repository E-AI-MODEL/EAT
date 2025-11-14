"""eat_parser.py
Simple EAT → dict parser and dict → EAT serializer in Python.
"""
import re
from typing import Any, Dict, List, Union

EatValue = Union[str, bool, List[str], Dict[str, Any], List[Dict[str, Any]]]
EatDocument = Dict[str, EatValue]

array_header_re = re.compile(r'^(\w+)\[(\d*)\]\{([^}]*)\}:\s*$')
block_header_re = re.compile(r'^(\w+)(?:\{([^}]*)\})?:\s*$')
exact_header_re = re.compile(r'^(\w+_exact):\s*$')
inline_kv_re = re.compile(r'^(\w+):\s+(.+)$')


def parse_eat(text: str) -> EatDocument:
    lines = text.splitlines()
    doc: EatDocument = {}

    current_block: str | None = None
    current_keys: List[str] = []
    in_multiline = False
    multiline_buffer: List[str] = []
    in_array = False

    for raw_line in lines:
        line = raw_line.rstrip()
        trimmed = line.strip()

        if not trimmed and not in_multiline:
            if current_block and not current_keys and not in_array:
                current_block = None
            continue

        if in_multiline and trimmed == '"""':
            if current_block:
                doc[current_block] = "\n".join(multiline_buffer)
            in_multiline = False
            current_block = None
            multiline_buffer = []
            continue

        if in_multiline:
            multiline_buffer.append(line)
            continue

        if trimmed.endswith('"""'):
            name = trimmed.split(":", 1)[0]
            current_block = name
            in_multiline = True
            multiline_buffer = []
            continue

        m_array = array_header_re.match(trimmed)
        if m_array:
            name, _, keys_raw = m_array.groups()
            current_block = name
            current_keys = [k.strip() for k in keys_raw.split(",")]
            in_array = True
            doc[name] = []
            continue

        if in_array and current_block and current_keys and "," in trimmed:
            values = [v.strip() for v in trimmed.split(",")]
            row = {k: (values[i] if i < len(values) else None) for i, k in enumerate(current_keys)}
            assert isinstance(doc[current_block], list)
            doc[current_block].append(row)
            continue

        m_inline = inline_kv_re.match(trimmed)
        if m_inline:
            name, raw_value = m_inline.groups()
            value: Any = raw_value.strip()
            lower = value.lower()
            if lower == "true":
                value = True
            elif lower == "false":
                value = False
            elif (value.startswith('"') and value.endswith('"')) or (value.startswith("'") and value.endswith("'")):
                value = value[1:-1]
            doc[name] = value
            current_block = None
            current_keys = []
            in_array = False
            continue

        m_exact = exact_header_re.match(trimmed)
        if m_exact:
            current_block = m_exact.group(1)
            current_keys = []
            in_array = False
            continue

        if current_block and current_block.endswith("_exact"):
            value = trimmed.strip('"')
            doc[current_block] = value
            current_block = None
            current_keys = []
            in_array = False
            continue

        m_block = block_header_re.match(trimmed)
        if m_block:
            name, keys_raw = m_block.groups()
            current_block = name
            current_keys = [k.strip() for k in keys_raw.split(",")] if keys_raw else []
            in_array = False
            if not keys_raw:
                doc[name] = []
            continue

        if current_block and current_keys and not in_array:
            values = [v.strip() for v in trimmed.split(",")]
            obj = {k: (values[i] if i < len(values) else None) for i, k in enumerate(current_keys)}
            doc[current_block] = obj
            current_block = None
            current_keys = []
            continue

        if current_block and not current_keys and not in_array:
            existing = doc.get(current_block)
            val = trimmed.rstrip(",")
            if existing is None:
                doc[current_block] = [val]
            elif isinstance(existing, list):
                existing.append(val)
            else:
                doc[current_block] = [existing, val]
            continue

    return doc


def stringify_eat(doc: EatDocument) -> str:
    lines: List[str] = []
    for key, value in doc.items():
        if key.endswith("_exact") and isinstance(value, str):
            lines.append(f"{key}:")
            lines.append(f'  "{value}"')
            lines.append("")
            continue

        if isinstance(value, list):
            if not value:
                lines.append(f"{key}:")
                lines.append("")
                continue

            if isinstance(value[0], str):
                lines.append(f"{key}:")
                for v in value:
                    lines.append(f"  {v}")
                lines.append("")
                continue

            if isinstance(value[0], dict):
                keys = list(value[0].keys())
                lines.append(f"{key}[{len(value)}]" + "{" + ", ".join(keys) + "}:")
                for row in value:
                    vals = [str(row.get(k, "")) for k in keys]
                    lines.append("  " + ", ".join(vals))
                lines.append("")
                continue

        if isinstance(value, dict):
            keys = list(value.keys())
            lines.append(f"{key}" + "{" + ", ".join(keys) + "}:")
            vals = [str(value.get(k, "")) for k in keys]
            lines.append("  " + ", ".join(vals))
            lines.append("")
            continue

        if isinstance(value, str):
            lines.append(f"{key}:")
            lines.append(f"  {value}")
            lines.append("")
            continue

        if isinstance(value, bool):
            lines.append(f"{key}: {'true' if value else 'false'}")
            lines.append("")
            continue

    return "\n".join(lines).rstrip() + "\n"
