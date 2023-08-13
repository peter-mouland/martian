/*
  class Robot
  purpose: to be able to take direction and move a long 2-dimensional grid
  note: must be able to detect 'scent' of lost robots from the grid it is on
 */
export class Robot {
    /**
     * @typedef {String<'N' | 'S' | 'W' | 'E'>} Direction
     */

    /**
     * @typedef {Array<number, number>} Coords
     * @description [x, y]
     */
    /**
     * @typedef {String<'R'|'L'|'F'>} Instruction
     */

    /**
     * Enum for state values.
     * @readonly
     * @enum {String}
     */
    DirectionDeg = {
        N: 0,
        S: 180,
        E: 90,
        W: 270,
    };
    /**
     * Enum for state values.
     * @readonly
     * @enum {number}
     */
    TurnDeg = {
        L: -90,
        R: +90,
    };

    /**
     * Enum for state values.
     * @readonly
     * @enum {string}
     */
    Status = {
        lost: 'lost',
        onMission: 'on-mission',
    };

    /**
     * @param start { Coords }
     * @param direction { Direction }
     * @param grid { Grid }
     * @param options { {debug: boolean }}
     * @returns void
     */
    constructor(start, direction, grid, options = {}){

        /**
         * @type array<Coords>
         */
        this.path = [start]
        this.directionDeg = this.DirectionDeg[direction];
        this.debug = options.debug
        this.status = this.Status.onMission; // store robot status. key: Robot; value: 'on-mission' | 'lost'
        this.grid = grid
        this.grid.addOccupant(this, start);
    }

    /**
     * @param coords { Coords }
     * @returns Coords
     */
    calculateNewCoords([x, y]) {
        switch (true) {
            case this.directionDeg===0: return [x, y+1];
            case this.directionDeg===180: return [x, y-1];
            case this.directionDeg===90: return [x+1, y];
            case this.directionDeg===270: return [x-1, y];
        }
    }
    /**
     * @param instruction { Instruction }
     */
    turn(instruction) {
        if (this.isLost()) return false;
        let newPosition = (this.directionDeg + this.TurnDeg[instruction])  % 360 // cope with large turns
        if (newPosition < 0) newPosition = 360 + newPosition
        this.directionDeg = newPosition;
        return true;
    }
    /**
     * @param instruction { Instruction }
     */
    moveOnce(instruction) {
        if (this.isLost()) return false;
        if (this.debug){
            console.log('moveOnce from ' + this.reportLocation(), 'facing (' +this.directionDeg+')' + this.reportDirection(), this.reportStatus(), 'to ' + instruction)
        }
        if (instruction === 'L' || instruction === 'R'){
            return this.turn(instruction)
        }

        const from = this.path.at(-1);
        const to = this.calculateNewCoords(from);
        const hasScent = this.grid.hasScent(from, to);
        if (hasScent) {
            if (this.debug) console.log('instruction ignored. previous occupant lost')
            return false; // if movement is same as previously lost occupant, don't do it
        }

        const moved = this.grid.moveOccupant(from, to);
        if (moved && this.grid.isOffGrid(to)) {
            this.setIsLost();
        } else if (moved) {
            this.path.push(to);
        }
        return moved;
    }

    /**
     * @param instructions { array<Instruction> }
     */
    move(instructions) {
        for (let i = 0; i<instructions.length; i++){
            this.moveOnce(instructions[i]);
        }
    }

    /**
     * @returns void
     */
    setIsLost() {
        this.status = this.Status.lost;
    }
    /**
     * @returns Boolean
     */
    isLost() {
        return this.status === this.Status.lost;

    }

    reportLocation() {
        return this.path.at(-1);
    }
    reportPath() {
        return this.path;
    }
    reportDirection() {
        switch (true) {
            // ripe for improvement
            case this.directionDeg===0: return 'N'
            case this.directionDeg===180: return 'S'
            case this.directionDeg===90: return 'E'
            case this.directionDeg===270: return 'W'
        }
    }
    reportStatus() {
        return this.isLost() ? 'LOST' : ''
    }
}
