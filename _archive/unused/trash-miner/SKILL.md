# trash-miner

## Purpose
Mine Reddit RSS feeds for pain points in any niche. Runs a full 6-phase pipeline: seed generation → subreddit discovery → RSS mining → normalisation → clustering → report.

## Triggers

"research [niche]"
"mine [niche]"
"find pain points for [niche]"
"run trash miner on [niche]"

## Inputs

| Parameter  | Required | Default        | Description                             |
|------------|----------|----------------|-----------------------------------------|
| niche      | yes      | —              | Topic to research e.g. "CRM software"|
| niche_type | no       | saas           | One of: saas, ecommerce, services, learning|
| subs       | no       | auto-discovered | Comma-separated subreddits to target    |

## Boundary Rules

NEVER run without a niche specified
NEVER skip normalisation — raw JSONL is not analysable
NEVER proceed to Phase 4 if Phase 3 returns 0 posts
NEVER proceed to Phase 5 if normalised JSONL is empty
If Phase 2 discovers 0 subreddits and none were provided, HALT and report to user
NEVER mine a subreddit cached within the last 7 days — skip it and use cached data

## Workflow

### Phase 0 — Ollama Health Check
**bash**  
`curl -s http://localhost:11434/api/tags`

If response is HTTP 200: proceed to Phase 1 with `--source llm`
If connection refused or error: proceed to Phase 1 with `--source google`
Log result to `~/clawd/data/trash_miner/.errors/YYYY-MM-DD.log`

### Phase 1 — Seed Generation
**bash**  
`cd /Users/igorsilva/PycharmProjects/trash_miner`
`python3 seed_factory.py --source [llm|google] --topic "{niche}" --count 10`

After running, check `seed_topics.txt` is non-empty
If empty: HALT. Log error. Report: "Seed generation failed for {niche}"

### Phase 2 — Scout Subreddits
Skip if user provided `subs` parameter — use provided list directly.
Check cache first:  
**bash**  
`cat ~/clawd/data/trash_miner/.cache/subreddits.json`
If cache exists and is less than 7 days old for this niche, use cached subreddits and skip to Phase 3.
Otherwise run:  
**bash**  
`python3 scout_subreddits.py "{niche}" --limit 5`

Parse output to extract subreddit names as comma-separated list
Save discovered subreddits to `~/clawd/data/trash_miner/.cache/subreddits.json`
If 0 subreddits found: HALT. Report: "No subreddits found for {niche} — provide --subs manually"

### Phase 3 — RSS Mining
**bash**  
`python3 rss_miner.py --mode fetch \`  
` --niche_type {niche_type} \`  
` --subs {subs} \`  
` --include_search --include_top --include_new \`  
` --include_comments --max_comments 10 \`  
` --max_posts 25 --t month \`  
` --only_pain_points`

Implement exponential backoff between RSS requests: 2s, 4s, 8s
After running, check `data/reddit_threads.jsonl` is non-empty
If empty: HALT. Log error. Report: "RSS miner returned 0 posts — subreddits may be wrong or rate-limited"

### Phase 4 — Normalise
**bash**  
`python3 normalize_reddit_jsonl.py \`  
` --input data/reddit_threads.jsonl \`  
` --output data/reddit_threads_normalized.jsonl \`  
` --dedupe --add_derived_fields`

After running, check `data/reddit_threads_normalized.jsonl` is non-empty
If empty: HALT. Log error. Report: "Normalisation produced no output"

### Phase 5 — Cluster Pain Points via Ollama
Read all entries from `data/reddit_threads_normalized.jsonl` where `is_pain_point`: true.
Extract title and summary from each entry.
Send to Ollama for clustering:
**bash**  
`curl -s http://localhost:11434/api/generate -d '{"model": "llama3.2", "prompt": "Cluster these Reddit pain points into 5 themes. Return JSON only: {"themes": [{"name": "...", "count": N, "examples": ["...", "..."]}]}

Pain points:
{pain_points_json}', "stream": false}'`

Parse the JSON response
If Ollama fails: fall back to bigram overlap grouping (group titles sharing 2+ consecutive words)
Store clusters in memory for Phase 6

### Phase 6 — Generate Report
Create directory:  
**bash**  
`mkdir -p ~/clawd/data/trash_miner/`
Save report to `~/clawd/data/trash_miner/{niche_slug}_{YYYYMMDD}.md` where `niche_slug` = niche lowercased with spaces replaced by underscores.
Report format:
# Trash Miner Report: {niche}
**Date:** {today}
**Subreddits mined:** {subs}
**Total threads:** {total_count}
**Pain point threads:** {pain_point_count}

## Top Pain Point Themes
1. {theme_name} — {count} mentions
 - "{example_1}"
 - "{example_2}"

2. {theme_name} — {count} mentions
...

## All Pain Point Threads
| Title | Subreddit | Date |
|-------|-----------|------|
| ... | ... | ... |
After saving, confirm to user: "Done. {pain_point_count} pain points found across {total_count} threads. Report saved to ~/clawd/data/trash_miner/{filename}.md"

## Error Logging
All errors logged to: `~/clawd/data/trash_miner/.errors/YYYY-MM-DD.log`
Format: [HH:MM:SS] Phase {N} — {error message}

## Acceptance Tests

 "research CRM software" → all 6 phases run, report file created
 Phase 0 Ollama down → falls back to google seeds, continues
 Phase 3 returns 0 posts → halts before Phase 4
 Report contains at least one theme section
 Cached subreddits used on second run for same niche