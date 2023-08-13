import { Grid } from './grid.mjs'
import { Robot } from './robot.mjs'

export class Controller {

    /**
     * @type array<Robot>
     */
    robots = [];

    scent = [] // 2d-array i.e.  // [x1][y1] = { 'x2_y2': Occupant }

    // controls one grid at a time. you want more grids, you need more controllers
    constructor(gridSize, options = {}) {
        this.debug = options.debug
        this.grid = new Grid(gridSize);
    }

    // controls all robots on a single grid.
    addRobot({ coords, direction }) {
        if (this.debug) console.log('addRobot')
        const robot = new Robot(coords, direction, { debug: this.debug }) // create robot + assign to grid
        this.robots.push(robot) // remember robots for reporting
        return robot;
    }

    report() {
        const report = []
        this.robots.forEach((robot) => {
            const item = `${robot.getLastKnownLocation().join(' ')} ${robot.getDirection()} ${robot.getStatus()}`
            report.push(item.trim())
        })
        console.log(report.join('\n'))
        return report.join('\n')
    }


    /**
     * @param coords { Coords }
     * @returns String
     */
    mapCoordsToScent(coords) {
        return `${coords[0]}_${coords[1]}`
    }
    /**
     * @description To store the scent source, and target location
     *      "The scent is left at the last grid position the robot occupied before disappearing over the edge"
     * @param occupant { Occupant }
     * @param from { Coords }
     * @param to { Coords }
     */
    addScent(occupant, from, to) {
        if (typeof this.scent[to[0]] === 'undefined') this.scent[to[0]] = []; // ensure array is initialised
        if (typeof this.scent[to[0]][from[1]] === 'undefined') this.scent[to[0]][from[1]] = {}; // ensure array is initialised
        const map = this.mapCoordsToScent(to);
        this.scent[from[0]][from[1]][map] = occupant
    }

    /**
     * @param from { Coords }
     * @param to { Coords }
     * @returns Occupant | undefined
     */
    hasScent(from, to) {
        const map = this.mapCoordsToScent(to);
        return this.scent[from[0]]?.[from[1]]?.[map]; // [x][y] = { 'x_y': Occupant }
    }


    /**
     * @param robot { Robot }
     * @param instruction { Turn | Movement }
     * @returns Boolean
     */
    moveOnce(robot, instruction) {
        const from = robot.getLocation()
        /*
         * @returns { boolean }
         */
        const validateMovement = (from, to) => !this.hasScent(from, to);
        const moved = robot.move(instruction, validateMovement)
        if (!moved) return false;

        const to = robot.getLocation()
        const hasScent = this.hasScent(from, to);
        if (hasScent) {
            if (this.debug) console.log('instruction ignored. previous occupant lost')
            return false; // if movement is same as previously lost occupant, don't do it
        }

        if (this.grid.isOffGrid(to)) {  // lost
            robot.setIsLost();
            this.addScent(robot, from, to);
        }
        return true;
    }

    /**
     * @param robot { Robot }
     * @param instructions { array<Turn | Movement> }
     */
    move(robot, instructions) {
        for (let i = 0; i<instructions.length; i++){
            this.moveOnce(robot, instructions[i]);
        }
    }
}
