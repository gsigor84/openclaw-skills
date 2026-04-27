What This Book Adds That Shape Up Doesn't
Shape Up teaches you how to shape work before building. Patton fills the gaps Shape Up leaves:

How to structure the output — what a good user story actually looks like
How to decompose big ideas into buildable slices — the mechanics of breaking down
How to write acceptance criteria — the confirmation layer that Shape Up skips
How to think about users, not features — the who/what/why frame
The flat backlog trap — why a list of features without a narrative always fails


1. The Core Mental Shift (NOT in Shape Up)

"The goal of using stories isn't to write better stories. The goal of product development isn't to make products."

The real goal is outcome and impact — a change in user behaviour that creates value. Not output (features shipped).
The three levels:

Output — what you build (features, code)
Outcome — what changes in user behaviour as a result
Impact — what the business gets because of that behaviour change

For your enforcer: The spec must state the outcome — what the user will do differently — not just the output. "Users can log in" is output. "Support staff resolve tickets 40% faster because they no longer switch apps" is outcome. Your tool should refuse a spec that only describes output.
Minimize output, maximize outcome and impact. Your job is to build less, not more.

2. Why Features Lists Always Fail (The Flat Backlog Trap)
A prioritised list of features — no matter how well written — loses the big picture. You can complete every item and still ship something incoherent.

"Scope doesn't creep; understanding grows."

What looks like scope creep is actually your team discovering what they didn't know they didn't know. The solution isn't tighter control — it's building shared understanding before building.
The Frankenstein problem: Adding good features one at a time produces a monster. The construction method is not the design tool.

3. The Story Map Structure (Shape Up has no equivalent)
A story map organises work in two axes:
Left → Right = Narrative flow (the order in which you'd tell the story of a user accomplishing something)
Top → Bottom = Priority (the most critical slice at the top, nice-to-haves below)
The Backbone = the top row of the map — the high-level steps a user takes, in sequence. These are summary-level tasks (the "getting ready in the morning" level, not "adjust shower temperature").
The Body = everything below — the details, alternatives, exceptions, and variations that fill in each step.
Building the map forces you to find holes. Every time a team builds one, they find things "we thought someone else was handling" and "the necessary stuff in between the big features we forgot to talk about."
For your enforcer: The spec output should be structured as a mini story map — backbone steps across the top, detail cards below. Not a flat list.

4. The Three Sizes of Stories (Replaces vague "elements" language)
Stories are like rocks — they break into smaller rocks, which are still rocks.
SizeNameDescriptionExampleLargeEpicToo big to build in a sprint, right-sized from a user/business perspective"User can manage their account"MediumStoryComplete from a user's perspective, takes a few days"User can update their email address"SmallTask/SubtaskDevelopment-level work, takes hours"Build email validation endpoint"
The right size depends on who you're talking to. For a spec, you want story-level — complete from the user's perspective, but small enough to be concrete.
Goal levels (from Alistair Cockburn):

Summary level — rolls up many tasks ("Getting ready in the morning")
Sea level — a task you'd complete before intentionally stopping ("Take a shower")
Subtask level — steps within a sea-level task ("Adjust water temperature")

Your spec should operate at sea level — complete user actions, not implementation steps.

5. The Story Template and Why It's Just a Conversation Starter
The Connextra template (widely used):

As a [type of user]
I want to [do something]
So that I can [get some benefit]

Critical caveat: This template is a conversation starter, not a spec. The card is not the requirement. The conversation is.
The template's value is forcing the writer to pause and answer three questions: who, what, and why. If you don't know who, question whether the story should exist at all.
For your enforcer: Use this template to structure the input — the rough idea the user brings. Then interrogate the "so that" clause hard. That's where the outcome lives. A weak "so that" ("so that users can do X") is just restating the feature. A strong "so that" describes a behaviour change or a problem solved.
Bad: "As a developer, I want a spec template so that I can write specs."
Good: "As a developer, I want to be forced to define acceptance criteria before writing code so that I stop building the wrong thing and wasting a day fixing it."

6. The 3 Cs — Card, Conversation, Confirmation (Shape Up covers Card only)
Shape Up covers the Card (the pitch) and the Conversation (shaping). What it doesn't cover is Confirmation — the agreement on how you'll know the work is done.
Confirmation = Acceptance Criteria
When you feel like you're converging on a solution, ask:

"If we build what we agree to, what will we check to confirm we're done?"

The answer is a short list of things to verify. This list is the acceptance criteria (also called story tests).
A second question that reveals holes:

"When it comes time to demonstrate this at a product review, how will we do that?"

Discussing the demo often adds items to acceptance criteria — for example, "we'll need realistic data to demonstrate it," which means loading test data becomes a must-have.
Acceptance criteria are not:

A list of implementation steps
A technical specification
Edge cases (those are QA territory)

Acceptance criteria are:

Observable outcomes from a user's perspective
Things you can check with a yes/no
The minimum bar for calling the story done

Example:
Story: "As a developer, I want the spec enforcer to reject vague ideas so I don't waste time building undefined things."
Acceptance criteria:

 If input contains no problem story, tool returns a specific rejection message
 If input has no "done" definition, tool asks a clarifying question before proceeding
 If input passes all checks, tool outputs a structured spec document


7. Discovery — The 4-Step Process Before Spec (Shape Up starts too late)
Shape Up assumes you already know what problem you're solving. Patton fills in what happens before that.
Four essential steps from big ambiguous idea to buildable spec:
Step 1: Frame the Idea
Set bounds. Answer: why are we building this, and who is it for? If you can't answer these, stop. Everything else depends on this framing.
Key framing questions:

What problem are we solving?
Who specifically has this problem?
What outcome would tell us we succeeded?
What's the business case for solving it now?

Step 2: Understand Customers and Users
Build a lightweight persona — not a 20-page document, but a shared sketch of who the user is and how they work today. Do it collaboratively, not alone.
A useful persona contains:

Role/type of user
What they're trying to accomplish (goal)
How they do it today (current workflow)
Where the current workflow breaks down (pain points)

"Now" map: Before designing your solution, map how users work today without it. This reveals the specific break points your solution needs to address. These are your "hot spots."
Step 3: Envision the Solution
Now shape the solution (this is where Shape Up picks up). But note: you should have done Steps 1 and 2 first.
Step 4: Minimise
Identify the smallest viable solution — the slice that achieves the target outcome, nothing more. Not minimum viable product as a shortcut — minimum viable as a discipline.

8. Slicing — How to Cut a Big Idea Down to Size
The magic of story maps is horizontal slicing. Once you've mapped the full story, you draw lines across the map to define releases.
How to slice:

State the specific outcome you need from this release (not "build the feature" — "what should users be able to do?")
Move cards above the line if they're required to achieve that outcome
Everything below the line is a later release

The question that unlocks slicing:

"Do you need ALL of this to go live for [specific event/outcome]?"

Almost always, the answer is no. Teams discover they need a small fraction of what they mapped.
For your enforcer: The spec output should explicitly state the release slice — what's in this version and what's deferred. This prevents the "we'll figure out what's MVP later" trap.

9. Risky Assumptions (Extends Shape Up's Rabbit Holes)
Shape Up calls these "rabbit holes" — technical or design unknowns. Patton adds a layer: assumption risks about users and outcomes, not just about implementation.
Name your risky assumptions:
Before building, explicitly list what you believe to be true that, if wrong, would require rethinking everything:
About users:

We believe [user type] has [this problem]
We believe they encounter it [in this context]
We believe their current workaround is [X]

About the solution:

We believe users will respond to the solution by [doing Y]
We believe the interaction will feel [intuitive/fast/etc.]
We believe [technical approach] is feasible within the time constraint

The smallest test: Before building the full solution, what's the smallest experiment that would confirm or kill your biggest assumption? This is the spec for your first slice.

10. Anti-Patterns Specific to This Book (Complement Shape Up's list)
Anti-PatternDescriptionFixOutput-only specsSpec describes features, not behaviour changeAdd outcome statement: "users will [do differently]"Flat backlogList of stories with no narrative structureOrganise as story map with backboneTemplate worshipWriting "As a user I want..." without the conversationTreat template as conversation starter, not deliverableMissing confirmationStories agreed but no acceptance criteria writtenAlways end with "what will we check to confirm done?"Discovery skippedShaping done before understanding who has the problemFrame and user-understand before shapingWrong size storiesEpics given to developers, subtasks given to stakeholdersMatch story size to the audience of the conversationPersona documents nobody readsBeautiful persona docs posted on walls, never usedBuild personas collaboratively, just-in-time, with the team

11. Key Phrases for Product Copy / Enforcer UX Writing

"Stories get their name from how they're supposed to be used, not from what you're trying to write down."


"If you're not getting together to have rich discussions about your stories, you're not really using stories."


"Scope doesn't creep; understanding grows."


"Minimize output, maximize outcome and impact."


"The best solutions come from collaboration between the people with the problems to solve and the people who can solve them."


"If the only thing you create while making sense of a big, ambiguous opportunity is smaller stories, then you're probably doing it wrong."


12. The Enforcer's Additional Checklist Items (Adds to Shape Up's gate)
Items from this book that Shape Up's checklist misses:

 Outcome is stated — what will users do differently, not just what feature exists
 A specific user type is named with context (not "the user" — which user, doing what)
 Current workflow is described — how does this person do it today without the solution?
 At least one assumption is named explicitly and marked as testable
 A release slice is defined — what's in this version vs. deferred
 Acceptance criteria exist — at least 2-3 checkable, observable outcomes
 The "so that" clause describes a behaviour change, not a feature restatement


Source: User Story Mapping by Jeff Patton (O'Reilly, 2014). Working reference extract — not a substitute for the full text.