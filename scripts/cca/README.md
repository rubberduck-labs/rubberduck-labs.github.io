# CCA practice test

Source for `public/playground/cca/`.

- `test.html`: the test page (styles, question bank `Q`, logic). Edit questions here.
- `build-guide.py`: the study guide, one page per topic. Edit rules, pairs and prompts here.
- `shared.css`: styles used by the guide pages.

Build:

```bash
python3 scripts/cca/build.py scripts/cca/test.html public/playground/cca/index.html
python3 scripts/cca/build-guide.py scripts/cca public/playground/cca/guide
```

Both builds keep the `/t.js` tracker and fail if it is missing.
