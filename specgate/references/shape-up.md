1. The Core Problem This Solves

"Wireframes are too concrete. Words are too abstract."

Most teams fail at specs because they either:

Go too abstract ("build a calendar") → no shared understanding
Go too concrete (wireframes, mockups) → locked into details before the problem is understood

The goal of shaping is to land in the middle: rough enough to leave room for decisions, specific enough to show it's been thought through.
A well-shaped idea has three properties:

It's rough — not pixel-perfect, but intentional
It's solved — the hard thinking has been done; no open design questions
It's bounded — clear about what it does NOT include


2. Setting the Appetite (The First Question to Ask)

"Fixed time, variable scope."

Appetite = how much time you're willing to spend. This is NOT an estimate. It's a constraint you set in advance.

A small batch = 1–2 weeks
A big batch = 6 weeks

The appetite shapes the solution. Once you define it, "good" becomes relative to the constraint — not to some imagined perfect version.
Key insight for the enforcer: The first question to any user isn't "what do you want to build?" — it's "how much time do you want to spend?" That answer defines everything that comes after.

3. Narrowing the Problem (The Interview Logic)

"We flip from asking 'What could we build?' to 'What's really going wrong?'"

Raw ideas are almost always too broad. The job is to find the specific, painful use case underneath.
The Calendar Example:
A customer asked for a "calendar view." Instead of building one, the team asked when she needed it — what was she doing when the thought occurred? She needed to check free meeting slots from home. The real problem wasn't "computerize the calendar" — it was "let me see free spaces." This narrowed a 6-month project to 6 weeks.
Warning: Grab-bags
Watch for requests framed as redesigns, "2.0" projects, or refactors with no single driving problem. These have no clear "done." Always demand a single specific story: "We need to rethink X because Y specifically breaks down when Z."
The diagnosis questions to drive:

What is the user doing when this problem occurs?
What specifically breaks down in their current workflow?
What parts of the existing system can stay the same?
What does "done" look like as a specific outcome?


4. Finding the Elements (Sketching at the Right Level)
The goal is to identify what the solution is made of — not what it looks like.
Breadboarding
A text-based sketch of the interface topology:

Places — screens, dialogs, menus (underlined)
Affordances — buttons, fields, copy (listed below the place)
Connection lines — what affordance takes you where

This forces you to work out the logical flow without committing to visual design. Gaps and questions surface naturally.
Fat Marker Sketches
Used when the solution is inherently visual (layout, arrangement). Draw with maximum stroke width — detail is impossible by design. The point is to capture the key spatial relationships without getting trapped in specifics.
Output: A list of concrete elements
Not "a calendar" but:

A 2-up monthly grid
Dots for events, no pill spans
Agenda list below that scrolls to a dot when tapped

This is the level of specificity a good spec produces.

5. Rabbit Holes and Out-of-Bounds (De-Risking)

"All it takes is one hole in the concept to derail the whole project."

After sketching elements, slow down and stress-test the concept. Ask:

Does this require new technical work we've never done before?
Are we assuming a design solution exists that we couldn't actually produce?
Is there a hard decision we're pushing onto the team that should be settled now?
Are we making assumptions about how parts fit together?

Patching a hole (example):
The To-Do Groups feature introduced dividers. Nobody addressed completed items. Rather than leaving it open, the shapers declared a specific decision: completed items stay exactly as before, with the group name appended. It's imperfect — but it eliminates a week of ambiguity for the team.
Declaring out-of-bounds:
Explicitly list what the project will NOT cover. Example: group notifications would only apply to messages — not to-dos, not chat mentions. Writing it down prevents a team from "reasonably" extending scope.
Scope hammering questions (use at the end of shaping):

Is this a must-have for the core use case?
Could we ship without this?
What happens if we don't do this?
Is this a new problem or a pre-existing one users already live with?
How likely is this case to occur?
When it does occur, is it core (used by everyone) or an edge case?


6. The Pitch Format (The Output Template)
The pitch is the finished spec. It has exactly five ingredients:
1. Problem
A single specific story that shows why the status quo doesn't work. Not a feature request — a situation where someone's workflow breaks.

Bad: "Users want a better search."
Good: "A manager searching for a message from 6 months ago has to scroll through hundreds of results because there's no way to filter by date or person."

2. Appetite
How much time this is worth. This prevents the conversation from drifting into expensive solutions. Stating it upfront makes everyone a partner in fitting the solution to the constraint.
3. Solution
The core elements in a form that others can understand. Use breadboards or fat marker sketches — not wireframes. High-level enough to leave room for designers, concrete enough that there are no open questions about what's being built.
4. Rabbit Holes
The known hard parts — called out explicitly. Either patched with a specific decision, or flagged as something that needs to be watched. Don't leave these for the team to discover mid-build.
5. No-Gos
Functionality and use cases explicitly excluded. Written down so no one "reasonably" extends scope. Protects the appetite.

7. The Anti-Patterns (What Makes a Spec Fail)
These are the failure modes your enforcer should detect and block:
Anti-PatternDescriptionSignalSolution without problemDiving straight into what to build without establishing whyNo "when does this break?" storyProblem without solutionNaming a pain without working out the elementsVague verbs: "improve", "rethink", "redesign"Grab-bagScope with no single driving use case"X 2.0", "redesign Y", "refactor Z"Over-specifiedWireframes or pixel-perfect mocks before elements are agreedLeads to bikeshedding on irrelevant detailsOpen rabbit holesUnsolved design/technical decisions left for the teamAny "we'll figure it out" in the conceptNo appetite setMissing time constraint means no test of proportionalityExpensive solutions look as valid as cheap onesMissing no-gosBoundaries not declaredTeam interprets silence as permission to extend

8. Key Quotes for Product Copy / UX Writing

"Diving straight into 'what to build' is dangerous. You don't establish any basis for discussing whether a solution is good or bad without a problem."


"A problem without a solution is unshaped work. Giving it to a team means pushing research and exploration down to the wrong level."


"The best problem definition consists of a single specific story that shows why the status quo doesn't work."


"Anybody can suggest expensive and complicated solutions. It takes work and design insight to get to a simple idea that fits in a small time box."


"Variable scope is not about sacrificing quality. The trick is asking which things actually matter, which things move the needle."


9. The Shaping Checklist (Enforcer's Validation Gate)
Before any code is generated, the spec must satisfy:

 A specific problem story exists (not a feature request)
 Appetite is defined (time constraint, not an estimate)
 Core elements are listed (not wireframes, not vague nouns)
 At least one rabbit hole is named and patched or flagged
 No-gos are explicitly listed
 "Done" is describable as a specific user outcome
 No open design or technical questions that could blow up scope