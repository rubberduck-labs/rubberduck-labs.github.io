import sys

src_path, out_path = sys.argv[1], sys.argv[2]
src = open(src_path, encoding="utf-8").read()

head_end = src.index("</style>\n") + len("</style>\n")
head, body = src[:head_end], src[head_end:]
head = "\n".join(l for l in head.split("\n") if "claude:viewport-fit-sides" not in l)
title = "<title>CCA Practice Test</title>"
assert head.count(title) == 1
head = head.replace(title, title + '\n<script src="/t.js" defer></script>')

page = (
    "<!doctype html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n"
    "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\">\n"
    "<meta name=\"description\" content=\"Unofficial practice questions for Claude Certified Architect – Foundations: a quick 25-question test and 45 more on three levels.\">\n"
    "<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>\n"
    + head + "</head>\n<body>\n" + body + ("" if body.endswith("\n") else "\n") + "</body>\n</html>\n"
)
for needle in ('<script src="/t.js" defer></script>', 'track("cca_start"', 'track("cca_score"', "window.rdTrack"):
    assert needle in page, needle
open(out_path, "w", encoding="utf-8").write(page)
print("built", out_path)
