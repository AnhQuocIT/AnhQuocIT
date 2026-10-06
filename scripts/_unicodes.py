from pathlib import Path

text = Path("profile.yml").read_text(encoding="utf-8")
extra = (
    "// $ ~ + = 0123456789 "
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    "()[]{}<>|/\\'\".,;:!?@#%&*_-"
    "·—–…→←▋"
)
chars = sorted(set(text + extra))
codes = []
for c in chars:
    o = ord(c)
    if c in "\n\t\r" or o < 32:
        continue
    codes.append(f"U+{o:04X}")
print(",".join(codes))
