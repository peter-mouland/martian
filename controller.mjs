import { Grid } from './grid.mjs'
import { Robot } from './robot.mjs'

export class Controller {

    /**
     * @type array<Robot>
     */
    robots = [];
    constructor(options = {}) {
        this.debug = options.debug
    }
    // controls one grid at a time. you want more grids, you need more controllers
    initGrid(gridSize) {
        this.grid = new Grid(gridSize);
    }

    // controls all robots on a single grid.
    addRobot({ coords, direction }) {
        if (this.debug) console.log('addRobot')
        const robot = new Robot(coords, direction, this.grid, { debug: this.debug }) // create robot + assign to grid
        this.robots.push(robot) // remember robots for reporting
        return robot;
    }

    report() {
        this.robots.forEach((robot) => {
            console.log(robot.reportLocation(), robot.reportDirection(), robot.reportStatus())
        })
    }
}
