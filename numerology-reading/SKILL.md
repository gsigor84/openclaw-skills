---
name: numerology-reading
version: "1.0"
description: "GG33 numerology reading skill. Takes a date of birth, calculates Life Path number, Birth-Day Energy, and Chinese/Vietnamese zodiac animal, then assembles a full structured reading from the knowledge file — warm, second-person, gift-quality output."
trigger: "numerology-reading"
runtime: agent
---

# Numerology Reading Skill (GG33 System)

## Trigger
`/numerology-reading [date of birth]`

Or: "give me a reading", "read my numerology", "numerology [date]"

**If invoked without a date:** Respond with:
> "What's your date of birth? (e.g., 7 September 1984)"

Never ask for a date without showing the expected format.

## Use

Given a date of birth, produce a complete GG33 numerology reading covering:
1. **Life Path Number** — core personality energy
2. **Birth-Day Energy** — what the day of the month adds
3. **Zodiac Animal** — Chinese/Vietnamese zodiac from Gregorian year
4. **Relationships** — soulmate, friendly, and enemy numbers
5. **Career & Money Path** — natural career direction
6. **Health Risk** — what to watch for

The reading is warm, direct, second-person — written like someone who knows this system telling a person about themselves. Not clinical. Not a database dump. A gift.

---

## Guiding Principles

**1. The reading is a light, not a mirror.**
State who the person is — don't describe them from a distance. Second person. Direct. No hedging.

**2. Every claim traces to the knowledge file.**
Nothing invented. If the knowledge file doesn't cover a specific point, omit it and write a shorter section using only what *is* covered. Do not guess.

**3. Calculation first, lookup second.**
Always run the math before opening the knowledge file. The numbers determine what sections to pull.

**4. Ambiguous dates get asked about, never assumed.**
If the format could mean two different dates, ask. Never guess month vs day.

**5. Tone is part of the spec.**
"Like someone who knows this system telling you about yourself" — that is a functional requirement, not a nice-to-have.

---

## Knowledge File

**Location:** `references/numerology-gg33.md` — co-located with this SKILL.md.

This file is the combined GG33 reference built from all cleaned source material. It contains:
- Numbers 1-9 deep dive (personality, soulmate/enemy, secrets, examples, career, health)
- Master numbers 11, 22, 33 (personality, examples, career guidance)
- Chinese/Vietnamese zodiac: all 12 animals, enemy sign pairs, practical rules
- Career & Money Paths by number
- Health Risks by number
- Number compatibility matrix (soulmate, friendly, love/hate, enemy)
- Jack Neil Podcast system breakdown (28 wealth code, 13 bloodlines, letterology, death code, reincarnation, western astrology body map)

**Excluded:** Other numerology systems (e.g., Dan Millman's system, Peaceful Warrior, Millman's Life-Purpose framework).

**The skill pulls ALL reading content from this file. No other source. No external knowledge. No hallucinated claims.**

If the knowledge file is missing or incomplete, halt and report: "Knowledge file not ready at `references/numerology-gg33.md`. Build it first."

---

## Calculation Logic

### 1. Life Path Number

Add ALL individual digits of the full birth date (month + day + year).

```
Example: 07/16/2001 -> 0+7+1+6+2+0+0+1 = 17 -> 1+7 = 8
```

Keep reducing until you reach a single digit (1-9) **unless** the sum is exactly 11, 22, or 33 — those are master numbers and stop there. Do not reduce master numbers further.

**Rule:** Only the **final** sum determines master number status. Intermediate 11/22/33 during addition are not relevant — keep adding. Master number check happens at the last reduction step only.

```
Example: 11/29/1991 -> 1+1+2+9+1+9+9+1 = 33 -> master number (stop, do not reduce)
Example: 02/11/1985 -> 0+2+1+1+1+9+8+5 = 27 -> 2+7 = 9 (not a master number)
Example: 09/09/1999 -> 0+9+0+9+1+9+9+9 = 46 -> 4+6 = 10 -> 1+0 = 1
```

### 2. Birth-Day Energy

Take the day of the month only. Reduce to a single digit (1-9).

```
Example: 16 -> 1+6 = 7
Example: 28 -> 2+8 = 10 -> 1+0 = 1
Example: 19 -> 1+9 = 10 -> 1+0 = 1
Example: 5 -> 5 (already single digit)
```

**Master number exceptions — do not reduce these:**
- Day 11 -> 11 (master energy — note this in the reading)
- Day 22 -> 22 (master energy — note this in the reading)
- Day 29 -> 2+9 = 11 (master energy — note this in the reading)

All other two-digit days reduce normally to a single digit. Only 11, 22, and 29 (->11) produce master birth-day energy.

### 3. Chinese/Vietnamese Zodiac Animal

Uses the Gregorian birth year directly. No lunar calendar adjustment — consistent with GG33 source material across all examples.

**Base reference:** 2008 = Rat

**12-year cycle order (index 0-11):**

| Index | Animal |
|-------|--------|
| 0 | Rat |
| 1 | Ox |
| 2 | Tiger |
| 3 | Cat (Rabbit) |
| 4 | Dragon |
| 5 | Snake |
| 6 | Horse |
| 7 | Goat |
| 8 | Monkey |
| 9 | Rooster |
| 10 | Dog |
| 11 | Pig |

**Formula:**
```
animal_index = (birth_year - 2008) mod 12
If the result is negative, add 12 to make it positive.
```

**Examples:**
```
2001: (2001 - 2008) = -7 -> -7 + 12 = 5 -> Snake
2008: (2008 - 2008) = 0 -> Rat
1990: (1990 - 2008) = -18 -> -18 + 12 = -6 -> -6 + 12 = 6 -> Horse
1977: (1977 - 2008) = -31 -> -31 + 12 = -19 -> -19 + 12 = -7 -> -7 + 12 = 5 -> Snake
```

Or equivalently: keep adding 12 until the number is 0-11.

Always display as **"Cat (Rabbit)"** when the animal is Cat — acknowledges both Vietnamese and Chinese naming. All other animals use their single name.

---

## Input Validation

**When asking for a date, always prompt with the format:**
> "What's your date of birth? (e.g., 7 September 1984)"

Prefer written month names over numeric formats to avoid DD/MM vs MM/DD confusion. The month-as-word format eliminates all ambiguity — no clarification step needed.

**Accepted formats (for when a user provides a date anyway):**
- `MM/DD/YYYY` — e.g., 07/16/2001
- `DD/MM/YYYY` — e.g., 16/07/2001
- `Month DD, YYYY` — e.g., July 16, 2001
- `YYYY-MM-DD` — e.g., 2001-07-16
- Written: `7 September 1984` — preferred

**Ambiguous numeric dates (e.g., 07/06/2001):**
Ask: "Could you clarify — is that July 6 or June 7?"

**Invalid or incomplete dates:**
"Send me a complete date — day, month, and year — and I'll run the reading."

---

## Reading Output Template

Structure the output exactly as below. Pull from the knowledge file for each section. Write in second person, warm and direct. No numerology terminology. No numbers. No celebrity examples.

```
## Personal Profile — [Full date written out: 7 September 1984]

### Core Traits

[3-4 sentences. Who they are in a room. How they come across. What gives them their edge. Then the shadow — what turns inward or works against them. No numerology terms. No "you carry 11 energy." Just describe the person.]

### Thinking Style

[2-3 sentences. How they process — reactive or reflective? Logic or instinct? What advantage does this give them? What's the downside — overthinking, slow to act, too impulsive?]

### Approach to Situations

[2-3 sentences. How they read environments, handle change, spot opportunities. Are they fast or careful? Adaptive or rigid? How do they relate to pace and unpredictability?]

### Relationships

[2-3 sentences. What kind of people balance them. What kind drain them. No soulmate numbers, no enemy numbers — describe the dynamic in plain human terms. "You do best with people who are steady and grounded" not "your soulmate number is 2."]

### Work & Money

[2-3 sentences. What kind of roles suit them. What environments feel limiting. Where do their opportunities come from — visibility, systems, persistence, connections? No "career path for 8 energy." Just describe what fits.]

**Important — conflicting career data:**
When the Life Path career direction and the Birth-Day Energy career direction point in different directions, include BOTH in the Work & Money section. Acknowledge the tension. Do not pick one and discard the other. The BDE is a second data source — if it contradicts the Life Path career direction, show the contradiction and let the person decide which fits them. Do not flatten the reading to a single career direction.

### Health & Energy

[2-3 sentences. Main risk — physical, mental, emotional? What drains them. What keeps them stable. Practical, not mystical. "Your main risk is burnout" not "watch your nervous system's electricity."]
```

**Internal mapping (skill use only — not visible in output):**
- Core Traits = Life Path number lookup
- Thinking Style = Birth-Day Energy lookup
- Approach to Situations = Zodiac Animal lookup
- Relationships = Number compatibility data (plain human translation)
- Work & Money = Career path data (no number references)
- Health & Energy = Health risk data (practical language)

**Important — LP 11 emotional intensity:**
When the Life Path is 11, the Core Traits section must include the emotional intensity directly. The 11 is the most emotionally charged number in the system. This is not metaphor — it is the defining trait. BDE=7 adds reflective internal processing ON TOP of that emotional base, not instead of it. Do not soften the 11's emotional charge. Do not describe a calm, composed person.

---

## Tone Rules

- **Second person:** "you are", "your strength is", "you tend to"
- **Warm but direct:** GG33 style, not a horoscope
- **No hedging:** "you are", not "you might be" or "some people say"
- **No disclaimers:** Never say "numerology isn't scientifically proven" — the reading is the reading
- **No invented material:** If the data isn't there, write a shorter section from what's available or skip it. Never invent content to fill a gap. Never tell the user something is missing — just deliver what you have (except the explicit “knowledge file missing” failure case).
- **Gift quality:** If the output reads like a database dump, it's wrong. Rewrite until it feels like someone speaking.

**Zero numerology terminology in output.** The following are internal calculation terms — none of them appear in the reading:
- "life path" / "life path number" / "LP"
- "birth-day energy" / "BDE"
- "master number" / "master energy"
- "zodiac animal" / "zodiac sign"
- "soulmate number" / "enemy number" / "friendly number"
- Any bare number (no "you are an 11" or "your number is 8")
- "energy" / "vibration" / "frequency" / "the system" / "the matrix"
- Celebrity examples ("Kobe", "Reagan", "Obama")
- "numerology" / "GG33" / "the reading"

Every claim in the output must be translatable to plain human description without losing meaning. If it doesn't read like a person describing a person, it doesn't ship.

---

## Failure Modes

| Condition | Response |
|---|---|
| Knowledge file missing | "The knowledge file isn't ready yet. It needs to be at `references/numerology-gg33.md`." |
| Ambiguous date | "Could you clarify — is that [A] or [B]?" |
| Incomplete date | "I need the full date — day, month, and year." |
| Master number career section thin (22/33) | Fall back to the core personality description for career guidance. Write a shorter Work & Money section from what's available. Do not explain the gap to the user — just deliver the best reading you can from the data that exists. |
| Number not found in knowledge file | Write from what's available. If there's genuinely nothing to pull from, skip the section. Never invent content. Never tell the user something is missing. |

---

## No-Gos

This skill does NOT:
- Run compatibility readings between two people
- Forecast personal years, timelines, or predictions
- Analyse names (letterology)
- Perform western astrology (sun signs, body part map)
- Calculate a death code
- Operate as a paid service or behind a paywall
- Output anything other than the 6-section structured reading

---

## Acceptance Tests

1. **Standard calculation:** Given 07/16/2001 -> Life Path = 8, Birth-Day Energy = 7, Zodiac = Snake. Reading includes all 6 sections.
2. **Master number calculation:** Given 11/29/1991 -> Life Path = 33, Birth-Day Energy = 11 (29 = 2+9), Zodiac = Goat. Life Path is NOT reduced to 6. Birth-Day Energy is NOT reduced to 2.
3. **Traceability check:** Every sentence in the output must be traceable to a section in the knowledge file. No invented claims.
4. **Tone check:** Output reads as a person speaking to someone about who they are — not a database query, not bullet points, not a disclaimer-wrapped horoscope.
5. **Zero numerology terminology check:** Output contains no internal calculation terms, no bare numbers, no celebrity examples, no esoteric language.
