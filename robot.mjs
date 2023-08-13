/*
  class Robot
  purpose: to be able to take direction and move a long 2-dimensional grid
*/
export class Robot {
    /**
     * @typedef {string<"N" | "S" | "W" | "E">} Direction
    /**
     * @typedef {array<number, number>} Coords
     * @description [x, y]
    /**
     * @typedef {string<"R"|"L">} Turn
    /**
     * @typedef {string<"F">} Movement
    /**
     * Enum for state values.
     * @readonly
     * @enum {string}
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
        lost: "lost",
        onMission: "on-mission",
    };

    /**
     * @param start { Coords }
     * @param direction { Direction }
     * @param options { {debug: boolean }}
     * @returns void
     */
    constructor(start, direction, options = {}){
        /**
         * @type array<Coords>
         */
        this.path = [start]
        this.directionDeg = this.DirectionDeg[direction];
        this.debug = options.debug
        this.status = this.Status.onMission; // store robot status. key: Robot; value: 'on-mission' | 'lost'
    }

    /**
     * @description calculate new coords after given movement
     *  _note:  this assumes knowledge of the current grid. hmm_
     * @param movement { Movement }
     * @returns Coords
     */
    calculateNewCoords(movement) {
        const [x, y] = this.getLocation();
        if (movement === 'F') {
            switch (true) {
                case this.directionDeg===0: return [x, y+1];
                case this.directionDeg===180: return [x, y-1];
                case this.directionDeg===90: return [x+1, y];
                case this.directionDeg===270: return [x-1, y];
                default: return [x, y];
            }
        }
    }

    /**
     * @param instruction { Turn }
     */
    turn(instruction) {
        if (this.isLost()) return false;  // return false to indicate no signal
        let newPosition = (this.directionDeg + this.TurnDeg[instruction])  % 360 // cope with large turns
        if (newPosition < 0) newPosition = 360 + newPosition
        this.directionDeg = newPosition;
        return true;
    }

    /**
     * @param instruction { Turn | Movement }
     * @param validator { function }
     */
    move(instruction, validator = () => true) {
        if (this.isLost()) return false; // return false to indicate no signal
        if (this.debug){
            console.log('moveOnce from ' + this.getLocation(), 'facing (' +this.directionDeg+')' + this.getDirection(), this.getStatus(), 'to ' + instruction)
        }
        if (instruction === 'L' || instruction === 'R'){
            this.turn(instruction)
        } else {
            const to = this.calculateNewCoords(instruction);
            if (validator(this.getLocation(), to)) {
                this.path.push(to);
            } else {
                return false
            }
        }
        return true

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

    getLocation() {
        return this.path.at(-1);
    }
    getLastKnownLocation() {
        return this.isLost() ? this.path.at(-2) : this.path.at(-1);
    }

    getDirection() {
        switch (true) {
            // ripe for improvement
            case this.directionDeg===0: return 'N'
            case this.directionDeg===180: return 'S'
            case this.directionDeg===90: return 'E'
            case this.directionDeg===270: return 'W'
        }
    }
    getStatus() {
        return this.isLost() ? 'LOST' : ''
    }
}
