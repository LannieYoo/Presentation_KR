
# CST8503 Planning Presentation

Solving planning problems with Knowledge Representation and Prolog

## Navigation

Overview

Prolog

Monkey Case

## Overview

speaker Jiaxing Yi

Page title

Overview of Knowledge Representation and Planning

Team

Jiaxing Yi

Peng Wang

Hye Ran Yoo

Presentation context

Course

CST8503 Knowledge Representation and Planning

Topic

How to solve planning problems using

Knowledge Representation KR

Prolog planning

Audience

Students who already did CST8503 labs and assignments

Students who want one clear big picture of planning with Prolog

Goals of this presentation

After this talk, the audience should

know what Knowledge Representation means in this course

know what a planning problem is in AI

have a simple picture of how Prolog can search for a plan

see one complete example Monkey and Bananas

take away a few practical study tips

Why this is useful

Planning can feel abstract when we only look at code.

By following one full example, it becomes easier to connect

the story level

the logical model

the Prolog rules and the final plan.

What is Knowledge Representation

Basic idea

Knowledge Representation is a way to describe facts about the world

so that a computer can reason logically about them.

We use

objects

monkey, box, bananas, locations l1, l2, l3

relations and properties

at  where something is

has  what the monkey holds

on_box  whether the monkey is on the box

states

snapshots of what is true now

described by fluents facts that can change over time.

Good Knowledge Representation makes it clear

what is true in the current state

which actions are allowed

what the world looks like after an action.

What is a planning problem

Planning problem in AI

given an initial state

given a goal condition

find a sequence of actions that leads from start to goal.

Examples

a robot moving through rooms

Blocks World

Monkey and Bananas

Key elements

state

actions with preconditions and effects

transitions between states

plan as a sequence of actions.

KR approach versus Machine Learning

Knowledge Representation based approach

uses explicit facts and logical rules

works well when the world is small and rules are clear

gives explainable plans.

Machine Learning approach

uses data and statistics

works well when rules are unknown or very complex.

In CST8503 the planning tasks are small, clear worlds,

so Knowledge Representation plus Prolog is a natural choice.

Closing message from Overview

Main point

Planning with Prolog is a structured process,

not random trial and error.

The presentation will

introduce Knowledge Representation and planning ideas

show the Prolog structure

walk through Monkey and Bananas as a template

finish with tips based on real experience.

## Prolog

speaker Peng Wang

Page title

Prolog planning structure and workflow

Big picture

In Prolog the planning system is built from

state representation

action representation

preconditions

effects

and a planner predicate that uses all of them together.

State representation

A state is represented with a situation variable S

and fluents that describe what is true in S.

Typical fluents

robot is at some location

locations are connected

Initial state

a special situation, often called s0

lists what is true at the beginning.

Goal condition

a fluent or a set of fluents that must be true in a final state

for Simple Navigation  robot is at the target location.

Actions as Prolog terms

Each action is written as a Prolog term.

Example actions

move From, To      robot moves from one location to another

For each action we later define

when it is allowed  preconditions

how it changes the state  effects.

Key planning predicates

Precondition rule

says when an action is allowed in a state

poss Action, S

Effect rule

says how an action changes one state into another

result Action, S1, S2

Planner rule

says which list of actions is a plan from a state to a goal

plan S, G, Plan

How Prolog searches for a plan

Prolog uses depth first search with backtracking.

Recursive Structure in Planning

Planning uses recursive structure similar to Fibonacci sequence.

Fibonacci Example for comparison

Base case

fib 0, 0.

fib 1, 1.

Recursive case

fib N, F  

  N  1,

  N1 is N  1,

  N2 is N  2,

  fib N1, F1,

  fib N2, F2,

  F is F1 + F2.

Planning Planner Example

Base case  goal already satisfied

plan S, G, []  holds G, S.

Recursive case  find action and continue planning

plan S, G, [A|Plan]  

  poss A, S,

  result A, S, S1,

  plan S1, G, Plan.

How Planning Recursion Works

Base case

if goal G is already true in state S,

the plan is empty [].

like fib 0 or fib 1 returning base values

Recursive case

choose an action A that is possible in S,

compute the next state S1,

recursively find a plan from S1 to G,

combine A with the rest of the plan.

like fib N calling fib N1 and fib N2

This recursive structure allows Prolog to explore

all possible sequences of actions until a plan is found,

similar to how Fibonacci recursively computes values.

Modelling steps checklist

Workflow for building a new planning problem

Step 1  write the story in plain language

Step 2  list objects and locations

Step 3  define important fluents

Step 4  define actions

Step 5  write preconditions for each action

Step 6  write effects for each action

Step 7  define the initial state and the goal

Step 8  implement the planner and run small test queries

## Monkey Case

speaker Hye Ran Yoo

Page title

Monkey and Bananas case study, tips, and conclusion

Story of the problem

World

one room with three locations l1, l2, l3.

Initial setup

monkey at l1

box at l2

bananas hanging at l3.

Monkey actions

go L          move to location L

push box L    push the box and move with it

climb         climb onto the box

grasp         grab the bananas.

Goal

at the end, the monkey has the bananas.

Planning elements summary

Initial state

monkey at l1

box at l2

bananas at l3

monkey does not have bananas

monkey is not on the box.

Goal

monkey has bananas.

Typical high level plan

go to the box

push the box under the bananas

climb onto the box

grasp the bananas.

Preconditions and effects in words

go

preconditions

<pre class="overflow-visible!" data-start="6467" data-end="6580"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>monkey </span><span>is</span><span> at </span><span>some</span><span></span><span>location</span><span> Here  
target </span><span>location</span><span></span><span>is</span><span> different </span><span>from</span><span> Here  
monkey </span><span>is</span><span></span><span>not</span><span></span><span>on</span><span> the </span><span>box</span><span>  
</span></span></code></div></div></pre>

effect

<pre class="overflow-visible!" data-start="6594" data-end="6646"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>monkey’s </span><span>location</span><span> becomes the target </span><span>location</span><span>.  
</span></span></code></div></div></pre>

push box

preconditions

<pre class="overflow-visible!" data-start="6680" data-end="6777"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>monkey </span><span>and</span><span></span><span>box</span><span> at the same </span><span>location</span><span>  
target </span><span>location</span><span></span><span>is</span><span> different </span><span>from</span><span> the </span><span>current</span><span> one  
</span></span></code></div></div></pre>

effects

<pre class="overflow-visible!" data-start="6792" data-end="6863"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>monkey </span><span>location</span><span> becomes target  
</span><span>box</span><span></span><span>location</span><span> becomes target.  
</span></span></code></div></div></pre>

climb

precondition

<pre class="overflow-visible!" data-start="6893" data-end="6934"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>monkey </span><span>and</span><span></span><span>box</span><span> at the same </span><span>location</span><span>  
</span></span></code></div></div></pre>

effect

<pre class="overflow-visible!" data-start="6948" data-end="6979"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>monkey </span><span>is</span><span> now </span><span>on</span><span> the </span><span>box</span><span>.  
</span></span></code></div></div></pre>

grasp

preconditions

<pre class="overflow-visible!" data-start="7010" data-end="7082"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>monkey </span><span>is</span><span></span><span>on</span><span> the </span><span>box</span><span>  
monkey </span><span>and</span><span> bananas at the same </span><span>location</span><span>  
</span></span></code></div></div></pre>

effect

<pre class="overflow-visible!" data-start="7096" data-end="7145"><div class="contain-inline-size rounded-2xl relative bg-token-sidebar-surface-primary"><div class="sticky top-9"><div class="absolute end-0 bottom-0 flex h-9 items-center pe-2"><div class="bg-token-bg-elevated-secondary text-token-text-secondary flex items-center gap-4 rounded-sm px-2 font-sans text-xs"></div></div></div><div class="overflow-y-auto p-4" dir="ltr"><code class="whitespace-pre!"><span><span>monkey has bananas </span><span>and</span><span> the goal </span><span>is</span><span> reached.  
</span></span></code></div></div></pre>

Plan as a short story

Step 1  start

monkey at l1, box at l2, bananas at l3.

Step 2  go to l2

monkey walks from l1 to l2.

Step 3  push box to l3

monkey pushes the box from l2 to l3

now monkey, box, and bananas are all at l3.

Step 4  climb

monkey climbs onto the box at l3.

Step 5  grasp

monkey grabs the bananas

the goal condition is satisfied.

Team reflection and tips

What was difficult

thinking in terms of states and fluents

remembering all preconditions

understanding why sometimes the planner found no plan.

How it improved

drawing small diagrams of each step

testing single actions with simple queries

explaining the story in natural language before changing rules.

Tips for other students

start with a very small version of the problem

write objects, locations, and fluents on paper

make a mini list of preconditions and effects for each action

if there is no plan, first check the initial state and the goal

use clear names so the code is easy to read later.

## References

Russell, Stuart, and Peter Norvig. Artificial Intelligence  A Modern Approach. Pearson.

Ghallab, Malik, Dana Nau, and Paolo Traverso. Automated Planning  Theory and Practice. Elsevier.

Course materials and assignment handout for CST8503 Knowledge Representation and Planning, Algonquin College.
