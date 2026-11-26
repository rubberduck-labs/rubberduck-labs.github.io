import sys, os, re, html as H
from urllib.parse import quote

src_dir, out_root = sys.argv[1], sys.argv[2]
shared_css = open(os.path.join(src_dir, "shared.css"), encoding="utf-8").read()
BASE = "/playground/cca/"
GUIDE = BASE + "guide/"

guide_css = """
.topics { display: flex; flex-wrap: wrap; gap: 4px 18px; font-size: .9rem; margin-top: -12px }
.topics a { color: var(--muted); text-decoration: none; padding: 2px 0; border-bottom: 2px solid transparent }
.topics a:hover { color: var(--fg) }
.topics a[aria-current="page"] { color: var(--fg); border-bottom-color: var(--accent) }
main { display: flex; flex-direction: column; gap: 28px }
.weight { color: var(--muted); font-weight: 500; font-size: 1rem; margin-left: 8px }
section { display: flex; flex-direction: column; gap: 12px }
.rules { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px }
.rules li { background: var(--panel); border-radius: 6px; padding: 12px 16px }
.rules b { font-weight: 600 }
.pairs { width: 100%; border-collapse: collapse; font-size: .95rem }
.pairs th { text-align: left; font-weight: 600; padding: 0 12px 8px 0; color: var(--muted); font-size: .85rem }
.pairs td { padding: 10px 12px 10px 0; vertical-align: top; border-top: 1px solid var(--line) }
.pairs td:first-child { width: 50% }
.recall { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px }
.recall details { background: var(--panel); border-radius: 6px; padding: 12px 16px }
.recall summary { cursor: pointer; font-weight: 500 }
.recall details p { margin: 8px 0 0; color: var(--fg) }
.recall .reveal { color: var(--muted); font-weight: 400; font-size: .85rem; margin-left: 6px }
.recall details[open] .reveal { display: none }
.cta { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 12px }
.btn { display: inline-block; background: var(--accent); color: var(--on-accent); font-weight: 500; text-decoration: none; padding: 10px 18px; border-radius: 6px }
.btn:hover { filter: brightness(1.08) }
.pn { display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; font-size: .95rem }
.overview { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px }
.overview a { display: flex; justify-content: space-between; gap: 12px; background: var(--panel); border-radius: 6px; padding: 14px 16px; color: var(--fg); text-decoration: none; font-weight: 500 }
.overview a:hover { background: var(--fill) }
.overview span { color: var(--muted); font-weight: 400 }
.claude { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 8px }
.claude li { background: var(--panel); border-radius: 6px; padding: 12px 16px; display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 6px 16px }
.claude .what b { display: block; font-weight: 600 }
.claude .what span { color: var(--muted); font-size: .9rem }
.claude .act { display: flex; gap: 14px; align-items: center; font-size: .9rem }
.claude button { background: none; border: 0; padding: 0; font: inherit; color: var(--accent); text-decoration: underline; text-underline-offset: 2px; cursor: pointer }
.claude textarea { flex-basis: 100%; width: 100%; font: .85rem var(--mono); background: var(--opt); color: var(--fg); border: 0; border-radius: 6px; padding: 10px }
.facts { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 6px }
@media print { .top, .topics, .cta, .pn { display: none } .recall details { break-inside: avoid } }
"""

C = lambda t: f"<code>{t}</code>"
plain = lambda t: H.unescape(re.sub(r"<[^>]+>", "", t))
INTRO = "I'm studying for Anthropic's Claude Certified Architect – Foundations exam (exam guide v1.1)."
SCEN = {"agents": "the customer support agent or the multi-agent research system", "tools": "the developer productivity tools or the multi-agent research system", "claude-code": "Claude Code for a team or Claude Code in CI", "prompting": "structured data extraction or Claude Code in CI", "context": "the customer support agent or structured data extraction"}
def prompts(t):
    rules = "\n".join("- " + plain(r) for r in t["rules"])
    pairs = "\n".join(f"- {plain(a)} vs {plain(b)}" for a, b in t["pairs"])
    return [
     ("Quiz me", "Ten exam-style questions, one at a time, with a score.",
      f"{INTRO} Quiz me on {t['name']}. Ask 10 scenario-based multiple-choice questions like the exam, one at a time. Wait for my answer before you reveal the right one, explain it in two sentences, and keep score. Where Anthropic's current docs differ from the exam guide, say so.\n\nWhat I should know:\n{rules}"),
     ("Explain the differences", "Each pair with an example and a way to remember it.",
      f"{INTRO} Explain the difference in each pair below, with one concrete example and a one-line way to remember it. Then test me on two of them.\n\n{pairs}"),
     ("Give me a case", "A realistic scenario to solve, then feedback.",
      f"{INTRO} Give me a realistic scenario like the exam's, based on {SCEN[t['slug']]}, that tests {t['name']}. Let me propose a design, then assess it against Anthropic's guidance and tell me what I missed."),
    ]
COPY_JS = """<script>
document.querySelectorAll("[data-copy]").forEach(b => b.addEventListener("click", () => {
  const text = b.closest("li").querySelector("textarea").value;
  const done = () => { b.textContent = "Copied"; };
  const fallback = () => { const ta = b.closest("li").querySelector("textarea"); ta.hidden = false; ta.focus(); ta.select(); b.textContent = "Select all and copy"; };
  try { navigator.clipboard.writeText(text).then(done, fallback); } catch (e) { fallback(); }
}));
</script>"""

TOPICS = [
 dict(slug="agents", short="Agents", name="Agent architecture", w=27, area="agents",
  rules=[
   f"<b>Loop on the stop reason.</b> Continue while {C('stop_reason')} is {C('tool_use')}; stop on {C('end_turn')}. Never on wording, a text block or a turn cap.",
   "<b>Subagents start empty.</b> Everything they need goes in their prompt: findings, sources, goal, output format.",
   f"<b>Spawn with the {C('Agent')} tool</b> (formerly {C('Task')}). It must be in {C('allowedTools')}. Several calls in one response run in parallel.",
   "<b>The coordinator is the hub.</b> It picks subagents, splits scope, checks for gaps and routes all messages.",
   f"<b>Guarantees live in code, not prompts.</b> {C('PreToolUse')} blocks a call; {C('PostToolUse')} fixes a result.",
   "<b>Chain when the steps are known; plan adaptively when they aren't.</b> Big reviews: per file, then across files.",
   f"<b>Sessions:</b> {C('--resume')} when old results still hold; fresh session plus summary when they're stale; {C('fork_session')} to compare two ideas.",
   "<b>Handoffs to a human</b> carry customer ID, what was checked, root cause and the recommended action."],
  pairs=[
   (f"{C('PreToolUse')}: before the call. Can block it.", f"{C('PostToolUse')}: after the call. Can change the result."),
   ("Prompt chaining: fixed steps, known in advance.", "Orchestrator-workers: steps decided at run time."),
   (f"{C('--resume')}: continue when earlier results still hold.", f"{C('fork_session')}: branch from the same point to compare."),
   ("Prompt rule: usually followed.", "Hook or gate: always enforced.")],
  recall=[
   ("Your loop ends when Claude writes \"Done\". What's wrong?", f"Loops stop on {C('stop_reason')}, not on wording. Continue on {C('tool_use')}, stop on {C('end_turn')}."),
   ("The coordinator never delegates. First thing to check?", f"Whether {C('allowedTools')} includes the subagent tool ({C('Agent')}, formerly {C('Task')})."),
   ("How do two subagents run at the same time?", "The coordinator emits both subagent calls in one response."),
   ("Refunds above $500 must never run automatically. How?", f"A {C('PreToolUse')} hook that blocks the call and tells the agent to escalate."),
   ("The files changed since yesterday's session. Resume or start fresh?", "Fresh session with a summary if most results are stale; resume and name the changed files if only a few changed.")]),
 dict(slug="tools", short="Tools & MCP", name="Tools & MCP", w=18, area="tools",
  rules=[
   "<b>The description picks the tool.</b> Say what it does, its input, edge cases, and when to use it instead of a similar one.",
   "<b>Overlapping tools get renamed or split</b>, not \"choose carefully\".",
   f"<b>Errors are structured:</b> {C('isError')}, a category (transient, validation, business, permission) and whether to retry.",
   "<b>Empty is not failed.</b> No results is a success; a timeout is an error.",
   "<b>4–5 tools per agent</b>, scoped to its role. One narrow cross-role tool for frequent needs.",
   f"<b>{C('tool_choice')}:</b> {C('auto')} may answer in text, {C('any')} forces some tool, a named tool forces that tool.",
   f"<b>Team MCP servers in {C('.mcp.json')}</b> with {C('${TOKEN}')}; personal ones in {C('~/.claude.json')}.",
   "<b>Glob finds files by name; Grep finds text in files.</b> If Edit isn't unique: Read, then Write."],
  pairs=[
   ("Glob: file names and paths.", "Grep: text inside files."),
   (f"{C('.mcp.json')}: project, committed, shared.", f"{C('~/.claude.json')}: user, personal, not shared."),
   (f"{C('any')}: must call some tool.", "Named tool: must call that tool."),
   ("Empty result: the search worked, nothing matched.", "Access failure: the search didn't run."),
   ("Resource: data the app attaches.", "Tool: an action the model calls.")],
  recall=[
   ("Claude mixes up two similar tools. First fix?", "Rewrite (or rename) both descriptions so each says when to use it instead of the other."),
   ("What should a tool error tell the agent?", f"{C('isError')}, the category, and whether a retry can help."),
   ("A search finds nothing. Error or success?", "Success with an empty list. A timeout is the error."),
   ("Team GitHub MCP server with personal tokens. Where?", f"{C('.mcp.json')} in the repo, with {C('${GITHUB_TOKEN}')} from each developer's environment."),
   ("Find every *.test.tsx file. Which tool?", "Glob.")]),
 dict(slug="claude-code", short="Claude Code", name="Claude Code", w=20, area="claude-code",
  rules=[
   f"<b>CLAUDE.md levels:</b> {C('~/.claude/CLAUDE.md')} is only yours; the project one is committed; subfolders load when you work there.",
   f"<b>Keep it modular</b> with {C('@path/to/file')} imports. {C('/memory')} shows what's loaded.",
   f"<b>Rules for file types</b> go in {C('.claude/rules/')} with {C('paths: [\"**/*.test.tsx\"]')}. They load only for matching files.",
   f"<b>Skills load on demand; CLAUDE.md always loads.</b> Team ones in {C('.claude/')}, personal ones in {C('~/.claude/')}.",
   f"<b>Skill frontmatter:</b> {C('context: fork')} isolates output, {C('disallowed-tools')} removes tools, {C('allowed-tools')} pre-approves them.",
   "<b>Plan mode</b> for big, multi-file or architectural changes. Direct execution for small, clear fixes.",
   "<b>Unfamiliar domain? Interview first.</b> Unclear transformation? Give 2–3 input/output examples. Tests first.",
   f"<b>CI:</b> {C('-p')} plus {C('--output-format json --json-schema')}. Review with a separate instance and pass earlier findings."],
  pairs=[
   (f"{C('~/.claude/CLAUDE.md')}: you only.", "Project CLAUDE.md: the whole team."),
   (f"{C('.claude/rules/')} with {C('paths')}: by file type, anywhere.", "Subfolder CLAUDE.md: one folder."),
   (f"{C('allowed-tools')}: runs without asking.", f"{C('disallowed-tools')}: can't run at all."),
   (f"{C('/clear')}: new, unrelated task.", f"{C('/compact')}: same task, less context."),
   ("Plan mode: several ways to do it.", "Direct execution: one obvious fix.")],
  recall=[
   ("A new teammate doesn't get the team's conventions. Likely cause?", f"They're in someone's {C('~/.claude/CLAUDE.md')}. Check with {C('/memory')}."),
   ("Test conventions for files spread across the repo?", f"A {C('.claude/rules/')} file with {C('paths: [\"**/*.test.tsx\"]')}."),
   ("A skill floods the conversation. Which frontmatter?", C("context: fork")),
   ("CI review keeps reposting old comments. Fix?", "Pass the earlier findings and ask only for new or unresolved issues."),
   ("Corrected Claude twice, still wrong. Next?", f"{C('/clear')} and one better prompt with what you learned.")]),
 dict(slug="prompting", short="Prompting", name="Prompting & structured output", w=20, area="prompting",
  rules=[
   "<b>Explicit criteria beat \"be conservative\".</b> Say what to report and what to skip, with an example per severity.",
   "<b>Few-shot examples show reasoning</b> on the ambiguous cases. Guide: 2–4. Docs: 3–5. Varied beats many.",
   "<b>Schemas stop syntax errors, not wrong values.</b> Validate sums and fields yourself.",
   f"<b>Nullable fields stop invented values.</b> Enums get {C('\"other\"')} plus a detail field.",
   "<b>Retry with the document, the failed output and the exact error.</b> It won't help if the data isn't there.",
   "<b>Batches:</b> about 50% cheaper, up to 24 hours, no tool calls mid-request. Never for something someone waits on.",
   "<b>Review with a fresh instance.</b> It catches more than self-review or more thinking.",
   "<b>Long documents first, question last.</b> Quote the relevant parts before answering."],
  pairs=[
   ("Syntax error: JSON doesn't parse. Schemas prevent it.", "Semantic error: totals don't add up. You must check."),
   ("Batches: cheap, slow, no waiting user.", "Synchronous API: someone is waiting."),
   ("\"Be conservative\": barely changes precision.", "Explicit categories: changes precision."),
   ("Self-review: same reasoning, same blind spots.", "Independent instance: fresh eyes.")],
  recall=[
   ("Reviews have too many false alarms. Fix?", "Explicit report/skip criteria with examples; switch off the noisiest category while you fix it."),
   ("The schema makes Claude invent missing values. Fix?", "Make those fields nullable."),
   ("Line items don't add up. What goes in the retry?", "The document, the failed extraction and the specific validation error."),
   ("Can a pre-merge check use Batches?", "No. It blocks someone; use the synchronous API."),
   ("How many few-shot examples?", "Guide 2–4, docs 3–5. More important: varied, with reasoning for ambiguous cases.")]),
 dict(slug="context", short="Context", name="Context & reliability", w=15, area="context",
  rules=[
   "<b>Case facts never get summarised.</b> Amounts, dates, IDs and promises go in a block sent every time.",
   "<b>Trim tool output</b> to the fields that matter. Key findings first; the middle of long input gets missed.",
   "<b>Escalate</b> on an explicit request (at once), a policy gap or no progress. Not on mood or self-rated confidence.",
   "<b>Several matches? Ask for another identifier.</b> Never guess.",
   "<b>Retry locally, then report:</b> failure type, what was tried, partial results, alternatives.",
   f"<b>Long exploration:</b> scratchpad files, subagents for verbose searches, manifests for recovery, {C('/compact')} when full.",
   "<b>97% overall can hide a bad segment.</b> Measure per document type and field; sample high-confidence results too.",
   "<b>Keep claim → source → date</b> through synthesis. Report conflicting figures with both sources."],
  pairs=[
   ("Customer asks for a human: escalate now.", "Customer is frustrated: offer to solve, escalate if they ask again."),
   ("Access failure: retry decision needed.", "Empty result: a valid answer."),
   ("Overall accuracy: one number.", "Per segment: where it actually fails."),
   ("Conflicting figures: show both with sources.", "Different years: not a conflict.")],
  recall=[
   ("Summaries turn \"$142.50 by Friday\" into \"refund discussed\". Fix?", "A case-facts block outside the summary, sent with every request."),
   ("Two customers match. What does the agent do?", "Ask for another identifier."),
   ("A subagent's query times out twice. What does it return?", "Failure type, the query, partial results and alternatives."),
   ("Accuracy is 97%. Can you stop human review?", "Not until you've checked accuracy per document type and field."),
   ("Two sources disagree on a figure. What goes in the report?", "Both figures, their sources and dates, marked as conflicting.")]),
]

def page(title, desc, active_topic, body):
    topics = "".join(f'<a href="{GUIDE}{t["slug"]}/"{" aria-current=\"page\"" if t["slug"] == active_topic else ""}>{H.escape(t["short"])}</a>' for t in TOPICS)
    over = ' aria-current="page"' if active_topic == "" else ""
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="{H.escape(desc)}">
<title>{H.escape(title)}</title>
<script src="/t.js" defer></script>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap">
<style>
{shared_css}{guide_css}</style>
</head>
<body>
<div class="wrap">
  <header class="top">
    <a class="brand" href="{BASE}">CCA Practice Test</a>
    <nav class="tabs" aria-label="Main">
      <a href="{BASE}#quick">Quick 25</a>
      <a href="{BASE}#all">All questions</a>
      <a href="{GUIDE}" aria-current="page">Study guide</a>
    </nav>
  </header>
  <nav class="topics" aria-label="Study guide topics"><a href="{GUIDE}"{over}>Overview</a>{topics}</nav>
  <main>
{body}
  </main>
  <footer>
    <div>
      <h2>Sources</h2>
      <ul>
        <li><a href="https://cc.sj-cdn.net/instructor/6nizmqk8tpzpfjvt6qmmav7rh/public/1794946250/Claude_Certified_Architect_-_Foundations_Exam_Guide.pdf" target="_blank" rel="noopener">Official exam guide</a> (PDF, v1.1)</li>
        <li><a href="https://platform.claude.com/docs/en/home" target="_blank" rel="noopener">Claude</a>, <a href="https://code.claude.com/docs/en/overview" target="_blank" rel="noopener">Claude Code</a> and <a href="https://modelcontextprotocol.io/docs/getting-started/intro" target="_blank" rel="noopener">MCP</a> docs</li>
        <li><a href="https://www.anthropic.com/engineering/building-effective-agents" target="_blank" rel="noopener">Building effective agents</a>, <a href="https://www.anthropic.com/engineering/writing-tools-for-agents" target="_blank" rel="noopener">Writing tools for agents</a>, <a href="https://www.anthropic.com/engineering/multi-agent-research-system" target="_blank" rel="noopener">Multi-agent research</a></li>
      </ul>
    </div>
    <div>
      <h2>About</h2>
      <p>Unofficial. Checked against exam guide v1.1 and the docs on 26 November 2026.</p>
      <p class="made">Made by <a href="https://rubberduck.no" target="_blank" rel="noopener">Rubberduck</a> ❤️ with Claude</p>
    </div>
  </footer>
</div>
{COPY_JS}
</body>
</html>
"""

def write(rel, text):
    path = os.path.join(out_root, rel, "index.html")
    os.makedirs(os.path.dirname(path), exist_ok=True)
    assert '<script src="/t.js" defer></script>' in text
    open(path, "w", encoding="utf-8").write(text)

items = "".join(f'<li><a href="{GUIDE}{t["slug"]}/">{H.escape(t["name"])} <span>{t["w"]}%</span></a></li>' for t in TOPICS)
overview = f"""    <div>
      <h1>Study guide</h1>
      <p class="lead">One page per area: the rules to remember, the pairs people mix up, and questions to test yourself.</p>
    </div>
    <section aria-labelledby="areas"><h2 id="areas">Areas</h2><ul class="overview">{items}</ul></section>
    <section aria-labelledby="claude"><h2 id="claude">Study with Claude</h2>
      <ul class="facts">
        <li>Let Claude quiz you. Answering from memory makes it stick better than rereading.</li>
        <li>When you get something wrong in the test, use "Ask Claude about this" to get it explained in your own context.</li>
        <li>Each topic page has ready-made prompts: a quiz, the pairs explained, and a case to solve. Open <a href="https://claude.ai" target="_blank" rel="noopener">Claude</a> next to the guide while you study.</li>
      </ul>
    </section>
    <section aria-labelledby="exam"><h2 id="exam">The exam in four lines</h2>
      <ul class="facts">
        <li>60 questions, 120 minutes. Some ask for one answer, some for several.</li>
        <li>4 scenarios out of 6: support agent, Claude Code for a team, multi-agent research, developer tools, Claude Code in CI, data extraction.</li>
        <li>Pass at a scaled 720 of 1,000.</li>
        <li>Unofficial site: practise here, but check the official guide.</li>
      </ul>
    </section>
    <section aria-labelledby="diff"><h2 id="diff">Where the exam guide and today's models differ</h2>
      <ul class="facts">
        <li>The guide teaches {C('tool_choice')} {C('any')} and forced tools. Claude Opus 5.5 and Sonnet 5.5 reject both; use {C('auto')} with clear instructions, or structured outputs.</li>
        <li>The guide says {C('Task')}; current SDKs call the subagent tool {C('Agent')}.</li>
        <li>The guide treats a skill's {C('allowed-tools')} as a restriction. Today it pre-approves tools; {C('disallowed-tools')} removes them.</li>
        <li>Assistant prefill is rejected on current models; use structured outputs.</li>
      </ul>
    </section>"""
write("", page("CCA Study Guide", "A to-the-point study guide for Claude Certified Architect – Foundations, one page per area.", "", overview))

for i, t in enumerate(TOPICS):
    rules = "".join(f"<li>{r}</li>" for r in t["rules"])
    claude_items = "".join(f'<li><span class="what"><b>{H.escape(n)}</b><span>{H.escape(d)}</span></span><span class="act"><button type="button" data-copy>Copy prompt</button><a href="https://claude.ai/new?q={quote(p)}" target="_blank" rel="noopener">Open in Claude</a></span><textarea hidden readonly rows="6" aria-label="{H.escape(n)} prompt">{H.escape(p)}</textarea></li>' for n, d, p in prompts(t))
    pairs = "".join(f"<tr><td>{a}</td><td>{b}</td></tr>" for a, b in t["pairs"])
    recall = "".join(f'<li><details><summary>{q}<span class="reveal">Show answer</span></summary><p>{a}</p></details></li>' for q, a in t["recall"])
    prev = f'<a href="{GUIDE}{TOPICS[i-1]["slug"]}/">← {H.escape(TOPICS[i-1]["name"])}</a>' if i > 0 else f'<a href="{GUIDE}">← Overview</a>'
    nxt = f'<a href="{GUIDE}{TOPICS[i+1]["slug"]}/">{H.escape(TOPICS[i+1]["name"])} →</a>' if i < len(TOPICS) - 1 else f'<a href="{BASE}#quick">Quick 25 →</a>'
    body = f"""    <div>
      <h1>{H.escape(t["name"])}<span class="weight">{t["w"]}% of the exam</span></h1>
    </div>
    <section aria-labelledby="remember"><h2 id="remember">Remember</h2><ul class="rules">{rules}</ul></section>
    <section aria-labelledby="pairs"><h2 id="pairs">Don't mix up</h2><table class="pairs"><tbody>{pairs}</tbody></table></section>
    <section aria-labelledby="recall"><h2 id="recall">Test yourself</h2><p class="lead" style="margin:0">Answer in your head, then check.</p><ul class="recall">{recall}</ul></section>
    <section aria-labelledby="claude"><h2 id="claude">Study with Claude</h2><p class="lead" style="margin:0">Ready-made prompts. Open one in Claude, or copy it into your own chat.</p><ul class="claude">{claude_items}</ul></section>
    <div class="cta"><a class="btn" href="{BASE}#{t["area"]}">Practise this area</a><span class="lead" style="margin:0">All {H.escape(t["name"])} questions in the test</span></div>
    <nav class="pn" aria-label="Previous and next">{prev}{nxt}</nav>"""
    write(t["slug"], page(f'{t["name"]} – CCA Study Guide', f'What to remember about {t["name"]} for Claude Certified Architect – Foundations.', t["slug"], body))
print("built guide pages")
