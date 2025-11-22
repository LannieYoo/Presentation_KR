# CST8503 Presentation: Knowledge Representation and Planning

Solving planning problems with Knowledge Representation and Prolog

---

## Navigation Menu

1. [Introduction](#introduction) - Jiaxing Yi
2. [Knowledge Representation and Planning Basics](#knowledge-representation-and-planning-basics) - Jiaxing Yi
3. [Prolog Solutions](#prolog-solutions) - Peng Wang
4. [Tips and Best Practices](#tips-and-best-practices) - Hye Ran Yoo
5. [Conclusion](#conclusion) - Jiaxing Yi
6. [References](#references)

---

## Team Members

- **Jiaxing Yi** - Introduction, KR Planning Basics, Conclusion
- **Peng Wang** - Prolog Solutions
- **Hye Ran Yoo** - Tips and Best Practices

---

## Introduction

**Speaker: Jiaxing Yi**

### Presentation Context

**Course:** CST8503 Knowledge Representation and Planning

**Topic:** How to solve planning problems using Knowledge Representation and Prolog planning

**Audience:**
- Students who already did CST8503 labs and assignments
- Students who want one clear big picture of planning with Prolog

### Goals of This Presentation

After this talk, the audience should:

- Know what Knowledge Representation means in this course
- Know what a planning problem is in Artificial Intelligence
- Have a simple picture of how Prolog can search for a plan
- Learn practical tips for solving planning problems with Prolog

### Why This Is Useful

Planning with Prolog can feel abstract when we only look at code. Understanding the structure and approach helps connect:

- Story level description
- Logical model of states and actions
- Prolog rules and the final plan

---

## Knowledge Representation and Planning Basics

**Speaker: Jiaxing Yi**

### What is Knowledge Representation

**Basic Idea:**

Knowledge Representation is a way to describe facts about the world so that a computer can reason logically about them.

**We Use:**

- **Objects**: agents, objects, locations (e.g., robot, items, rooms)
- **Relations and Properties**:
  - `at(object, location)` - where something is
  - `has(agent, item)` - what an agent holds
  - `on(object1, object2)` - spatial relationships
- **States**: Snapshots of what is true now, described by fluents that can change over time

**Good Knowledge Representation makes it clear:**

- What is true in the current state
- Which actions are allowed
- What the world looks like after an action

### What is a Planning Problem

**Planning problem in Artificial Intelligence:**

- Given an initial state
- Given a goal condition
- Find a sequence of actions that leads from start to goal

**Examples:**

- Robot moving through rooms
- Blocks World
- Navigation problems

**Key Elements:**

- State
- Actions with preconditions and effects
- Transitions between states
- Plan as a sequence of actions

### Knowledge Representation Approach versus Machine Learning

**Knowledge Representation based approach:**

- Uses explicit facts and logical rules
- Works well when the world is small and rules are clear
- Produces explainable plans

**Machine Learning approach:**

- Uses data and statistics
- Works well when rules are unknown or very complex

**In CST8503**, the planning tasks are small and clear, so Knowledge Representation plus Prolog is a natural choice.

---

## Prolog Solutions

**Speaker: Peng Wang**

### Big Picture

In Prolog the planning system is built from:

- State representation
- Action representation
- Preconditions
- Effects
- And a planner predicate that uses all of them together

### State Representation

A state is represented with a situation variable `S` and fluents that describe what is true in `S`.

**Typical fluents:**

- Robot is at some location
- Locations are connected

**Initial state:**

- A special situation, often called `s0`
- Lists what is true at the beginning

**Goal condition:**

- A fluent or a set of fluents that must be true in a final state
- For Simple Navigation: robot is at the target location

### Actions as Prolog Terms

Each action is written as a Prolog term.

**Example actions:**

- `move(From, To)` - robot moves from one location to another

For each action we later define:

- When it is allowed (preconditions)
- How it changes the state (effects)

### Key Planning Predicates

**Precondition rule:**

- Says when an action is allowed in a state
- `poss(Action, S)`

**Effect rule:**

- Says how an action changes one state into another
- `result(Action, S1, S2)`

**Planner rule:**

- Says which list of actions is a plan from a state to a goal
- `plan(S, G, Plan)`

### Recursive Structure in Planning

Planning uses recursive structure similar to Fibonacci sequence.

**Fibonacci Example (for comparison):**

```prolog
% Base case
fib(0, 0).
fib(1, 1).

% Recursive case
fib(N, F) :-
    N > 1,
    N1 is N - 1,
    N2 is N - 2,
    fib(N1, F1),
    fib(N2, F2),
    F is F1 + F2.
```

**Planning Planner Example:**

```prolog
% Base case: goal already satisfied
plan(S, G, []) :-
    holds(G, S).

% Recursive case: find action and continue planning
plan(S, G, [A|Plan]) :-
    poss(A, S),
    result(A, S, S1),
    plan(S1, G, Plan).
```

**How Planning Recursion Works:**

- **Base case**: If goal G is already true in state S, the plan is empty `[]`. (like `fib(0)` or `fib(1)` returning base values)

- **Recursive case**: Choose an action A that is possible in S, compute the next state S1, recursively find a plan from S1 to G, combine A with the rest of the plan. (like `fib(N)` calling `fib(N-1)` and `fib(N-2)`)

This recursive structure allows Prolog to explore all possible sequences of actions until a plan is found, similar to how Fibonacci recursively computes values.

### How Prolog Searches for a Plan

Prolog uses depth first search with backtracking.

**Planner idea in words:**

- If the goal is already true in the current state → the plan is empty
- Otherwise → choose an action that is possible in this state, compute the next state using the effect rule, continue planning from that next state

If this attempt fails, Prolog backtracks and tries another action or another sequence.

**We define:**

- When actions are possible
- How they change the world
- When the goal is satisfied

And Prolog explores the possible sequences of actions.

### Modelling Steps Checklist

**Workflow for building a new planning problem:**

1. Step 1: Write the story in plain language
2. Step 2: List objects and locations
3. Step 3: Define important fluents
4. Step 4: Define actions
5. Step 5: Write preconditions for each action
6. Step 6: Write effects for each action
7. Step 7: Define the initial state and the goal
8. Step 8: Implement the planner and run small test queries

---

## Tips and Best Practices

**Speaker: Hye Ran Yoo**

### Common Challenges and Solutions

**What students often find difficult:**

- Thinking in terms of states and fluents
- Remembering all preconditions for actions
- Understanding why sometimes the planner found no plan
- Debugging Prolog code when planning fails

### Recommended Approach

**Step-by-step workflow:**

1. **Start simple** - Begin with a very small version of the problem
2. **Draw diagrams** - Visualize states and transitions on paper
3. **Write objects and fluents** - List all objects, locations, and fluents clearly
4. **Define actions systematically** - Make a mini list of preconditions and effects for each action
5. **Test incrementally** - Test single actions with simple queries before running the full planner
6. **Debug systematically** - If there is no plan, first check:
   - The initial state is correctly defined
   - The goal condition is reachable
   - All preconditions are satisfied

### Practical Tips for Success

- **Start with a very small version of the problem** - Don't try to solve everything at once
- **Write objects, locations, and fluents on paper** - Visual planning helps clarify structure
- **Make a mini list of preconditions and effects for each action** - Keep this reference handy while coding
- **Use clear, descriptive names** - `at(monkey, l1)` is better than `a(m, 1)`
- **Test each action individually** - Use simple queries like `poss(go(l2), s0)` to verify preconditions
- **Explain the story in natural language first** - Understand the problem before coding
- **Check the initial state and goal first** - If planning fails, verify these are correct
- **Use diagrams to visualize state transitions** - Draw each step to understand the flow

---

## Conclusion

**Speaker: Jiaxing Yi**

### Main Point

Planning with Prolog is a structured process, not random trial and error.

### This Presentation

This presentation has:

- Introduced Knowledge Representation and planning ideas
- Shown the Prolog structure and recursive planner
- Provided practical tips and best practices for solving planning problems

### Key Takeaways

1. **Knowledge Representation** provides a way to model the world using facts and logical rules
2. **Planning** involves finding a sequence of actions from an initial state to a goal state
3. **Prolog's recursive structure** makes it natural for implementing planners
4. **Step-by-step approach** helps break down complex planning problems into manageable parts

### Closing Message

By understanding the fundamentals of Knowledge Representation and seeing how Prolog can be used to solve planning problems, you now have the foundation to tackle more complex planning challenges. Remember to start simple, test incrementally, and always connect your logical models back to the real-world story.

---

## References

### Books

- Russell, Stuart, and Peter Norvig. **Artificial Intelligence: A Modern Approach.** Pearson.

- Ghallab, Malik, Dana Nau, and Paolo Traverso. **Automated Planning: Theory and Practice.** Elsevier.

### Course Materials

- Course materials and assignment handout for **CST8503 Knowledge Representation and Planning**, Algonquin College.

### Additional Resources

- Prolog documentation and tutorials for planning implementations
- Examples from CST8503 lab exercises and assignments
- Team collaboration and peer learning experiences

---

## Presentation Timing Guide

**Total Duration: 7-12 minutes**

1. **Introduction** (Jiaxing Yi) - 1-2 minutes
2. **Knowledge Representation and Planning Basics** (Jiaxing Yi) - 2-3 minutes
3. **Prolog Solutions** (Peng Wang) - 4-5 minutes (more detailed explanation)
4. **Tips and Best Practices** (Hye Ran Yoo) - 2-3 minutes
5. **Conclusion** (Jiaxing Yi) - 1 minute
6. **References** (Brief mention) - 30 seconds

**Total: 8-12 minutes**

**Note:** Each speaker should practice their section to ensure smooth transitions and stay within the time limit.

