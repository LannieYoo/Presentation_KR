:- encoding(utf8).
% Blocks World Planning System (using Situation Calculus, SWI-Prolog)
% ------------------------------------------------------
% This program can automatically plan how to move blocks from initial state to goal state.
% Main components:
%   - Block and location definitions
%   - Initial state (starting positions of all blocks)
%   - Move action rules (when blocks can be moved)
%   - State change rules (how block positions change after moves)
%   - Automatic planning algorithm (find shortest move sequence)
%
% ============================================================================
% Prolog Core Concepts: Structure, Predicate, and Fact
% ============================================================================
%
%  - Structure = data object (e.g., block(a) = "block a")
%  - Predicate = query template (e.g., clear(what, what) = "what is clear in what state")
%  - Fact = specific answer (e.g., clear(block(c), []) = "block c is clear in initial state")
%
% About the [] parameter (state parameter):
%
% Why do we need state parameters?
%  - The same fact may differ in different states (e.g., after moving blocks, positions change)
%  - State parameters allow us to query facts "in a specific state"
%  - By recursively passing states, the program can track state changes at each step
%
% Examples:
%  - clear(block(c), []) means "block c is clear in the initial state"
%  - clear(block(c), [move(block(c), block(a), location(2))]) means "is block c clear after executing the move action"
%
% ============================================================================

% Discontiguous declarations to allow initial state facts and successor state axioms
% to be separated for better code organization
:- discontiguous on/3.
:- discontiguous clear/2.

% ============================================================================
% Initial State: Starting positions of blocks
% ============================================================================

% There are three blocks in the system: a, b, c
block_exists(block(a)).
block_exists(block(b)).
block_exists(block(c)).

% There are four locations in the system: 1, 2, 3, 4
location_exists(location(1)).
location_exists(location(2)).
location_exists(location(3)).
location_exists(location(4)).

% Which blocks or locations are clear (can have something placed on them)
% Blocks c and b are clear, locations 2 and 4 are clear
clear(block(c), []).
clear(block(b), []).
clear(location(2), []).
clear(location(4), []).

% Block positions:
% - Block a is on location 1
% - Block b is on location 3
% - Block c is on block a (so a's top is not clear)
on(block(a), location(1), []).
on(block(b), location(3), []).
on(block(c), block(a), []).

% ============================================================================
% Precondition Axioms: When blocks can be moved
% ============================================================================
%
% Note: move(Block, From, To) is a structure representing "move block Block from From to To"
%      move does not need to be defined separately; it is defined here through poss rules
%      that specify "when this action can be executed"
%
% About the parameter [move(Block, From, To) | S]:
%   - This is Prolog list syntax, representing an "action sequence" (plan)
%   - Format: [action | history of actions]
%   - move(Block, From, To) is the head of the list, representing "the newest action to execute"
%   - S is the tail of the list, representing "the sequence of actions executed before" (history)
%   - Example: [move(a,1,2), move(b,3,1)] means:
%            First execute move(b,3,1) (move b from location 3 to location 1)
%            Then execute move(a,1,2) (move a from location 1 to location 2)
%   - In planning problems, this list represents time order from right to left (newest action on left)

% Empty state (initial state) is always valid
poss([]).

% To execute the action "move block Block from From to To", all of the following conditions must be met:
% 1. Previous state S must be valid (can execute the previous action sequence)
% 2. Block must be a real existing block
% 3. Block's top must be clear (cannot have other blocks on it, otherwise cannot pick it up)
% 4. Block must currently be at From position (cannot move a block that is not there)
% 5. Block cannot move to its own position (prevent meaningless moves)
% 6. From must be a valid location or block
% 7. To must be a valid location or block
% 8. To's top must be clear (target position must have space to place the block)
poss([move(Block,From,To)|S]):-
    poss(S),
    block_exists(Block),
    clear(Block,S),
    (location_exists(To) ; block_exists(To)),
    Block \= To,
    clear(To,S),
    (location_exists(From);block_exists(From)),
    on(Block,From,S).



% ============================================================================
% Successor State Axioms: How block positions change after moves
% ============================================================================
% This section defines how the blocks world changes after executing move actions.

% Case 1: Something is moved away from X -> X becomes clear
%   Condition 1: poss([move(Z,X,Y) | S]) - This move action must be valid
clear(X,[move(Z,X,Y)|S]):-
    poss([move(Z,X,Y)|S]).

% Case 2: Other actions, and X's state remains unchanged
%   Condition 1: poss([A | S]) - Action A must be valid
%   Condition 2: A \= move(_, _, X) - Exclude actions that move something onto X
%   Condition 3: clear(X, S) - X was clear before, and action A doesn't affect X, so X remains clear
clear(X, [A | S]) :-
    poss([A | S]),
    A \= move(_, _, X),
    clear(X, S).

% Case 3: X is moved onto Y -> X is on Y
%   Condition 1: poss([move(X, Z, Y) | S]) - This move action must be valid
on(X, Y, [move(X, Z, Y) | S]) :-
    poss([move(X, Z, Y) | S]).

% Case 4: Other actions, and the relationship "X on Y" remains unchanged
%   Condition 1: poss([A | S]) - Action A must be valid
%   Condition 2: A \= move(X, Y, _) - Exclude actions that move X away from Y
%   Condition 3: on(X, Y, S) - X was on Y before, and action A doesn't affect this relationship, so it remains
on(X, Y, [A | S]) :-
    poss([A | S]),
    A \= move(X, Y, _),
    on(X, Y, S).


% ============================================================================
% Automatic Planning: Find shortest move sequence
% ============================================================================
% This code implements automatic planning functionality. When you provide a goal,
% the program will automatically try all
% possible move sequences, starting from the shortest, until it finds one that
% achieves the goal.

plan(Goal, Plan) :-
    bposs(Plan),
    call(Goal).

bposs(S) :-
    tryposs([], S).

tryposs(S, S) :-
    poss(S).

tryposs(X, S) :-
    tryposs([_ | X], S).

% ============================================================================
% Usage Examples
% ============================================================================
%
% Example 1: Query initial state
%   ?- on(block(c), block(a), []).
%   true.
%
%   ?- clear(block(c), []).
%   true.
%
% Example 2: Query state after a move
%   ?- on(block(c), location(2), [move(block(c), block(a), location(2))]).
%   true.
%
%   ?- clear(block(a), [move(block(c), block(a), location(2))]).
%   true.
%
% Example 3: Check if a move is possible
%   ?- poss([move(block(c), block(a), location(2))]).
%   true.
%
% Example 4: Plan to achieve a goal state
%   ?- plan(on(block(c), location(2), Plan), Plan).
%   Plan = [move(block(c), block(a), location(2))] ;
%   ...
%
% Example 5: Plan to stack blocks
%   ?- plan(on(block(b), block(c), Plan), Plan).
%   Plan = [move(block(b), location(3), block(c))] ;
%   ...
%
% Example 6: Plan requiring multiple steps
%   ?- plan(on(block(a), block(b), Plan), Plan).
%   Plan = [move(block(a), location(1), block(b)), move(block(c), block(a), location(2))] ;
%   ...
