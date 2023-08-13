# Martian Robots

## Running

- testing: `npm test`
- run: `npm start`

_[Developer Notes](#developer-notes)_

## The Problem

The surface of Mars can be modeled by a rectangular grid around which robots are able to move according to instructions provided from Earth. You are to write a program that determines each sequence of robot positions and reports the final position of the robot.

A robot position consists of a grid coordinate (a pair of integers: x-coordinate followed by y-coordinate) and an orientation (N, S, E, W for north, south, east, and west). A robot instruction is a string of the letters “L”, “R”, and “F” which represent, respectively, the instructions:

- Left : the robot turns left 90 degrees and remains on the current grid point.
- Right : the robot turns right 90 degrees and remains on the current grid point.
- Forward : the robot moves forward one grid point in the direction of the current orientation and maintains the same orientation.

The direction North corresponds to the direction from grid point (x, y) to grid point (x, y+1). There is also a possibility that additional command types may be required in the future and provision should be made for this.
Since the grid is rectangular and bounded (...yes Mars is a strange planet), a robot that moves “off” an edge of the grid is lost forever. However, lost robots leave a robot “scent” that prohibits future robots from dropping off the world at the same grid point. The scent is left at the last grid position the robot occupied before disappearing over the edge. An instruction to move “off” the world from a grid point from which a robot has been previously lost is simply ignored by the current robot.

### The Input

The first line of input is the upper-right coordinates of the rectangular world, the lower-left coordinates are assumed to be 0, 0.

The remaining input consists of a sequence of robot positions and instructions (two lines per robot). A position consists of two integers specifying the initial coordinates of the robot and an orientation (N, S, E, W), all separated by whitespace on one line. A robot instruction is a string of the letters “L”, “R”, and “F” on one line.

Each robot is processed sequentially, i.e., finishes executing the robot instructions before the next robot begins execution.

The maximum value for any coordinate is 50.

All instruction strings will be less than 100 characters in length.

### The Output

For each robot position/instruction in the input, the output should indicate the final grid position and orientation of the robot. If a robot falls off the edge of the grid the word “LOST” should be printed after the position and orientation.

## Sample Input

```
5 3
1 1 E
RFRFRFRF

3 2 N
FRRFLLFFRRFLL

0 3 W
LLFFFLFLFL
```
## Sample Output

```
1 1 E
3 3 N LOST
2 3 S
```

# Developer Notes

- Approach:
  - We have three classes, Robot, Grids and Controllers.
    - Robots and Grids do not know about each other
    - A Controller is used to instruct the Robot, and validate the result against the Grid
  - a Robot can only be on one grid
  - a Grid can contain many robots
  - benefits: clearer bounds of responsibilities, controller is extensible
    - e.g. could enable robot-to-robot comm's to recover lost souls
- Language:
  - Kept with NodeJS for simplicity
  - used Type annotations (i.e. https://jsdoc.app/) for typings
  - _should have just used typescript!_
- Sending instructions:
  - currently done via index.mjs, but could be adapted to read in a file
- Testing:
  - tests has been added for robot, and a single integration for controller
  - before going to prod, more tests should be added to cover the grid and the controller, especially the 'scent' feature
  - NodeJS test library has been used for simplicity
