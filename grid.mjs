/*
  class Grid
  purpose: to serve as a mechanism to set 'bounds' _and_ store 'scent' of lost robots

  note: must be able to communicate 'scent' of lost robots
*/

export class Grid {

    /**
     * @typedef {Array<number, number>} Coords
     * @description [x,y]
     */
    /**
     * @typedef {Array<number, number>} GridSize
     * @description [height, width]
     */
    /**
     * @typedef {Robot} Occupant
     * @description a 'thing' that occupies a space on the grid
     */
    /**
     * @param grid { GridSize }
     */
    constructor([width, height]) {
        this.height = height;
        this.width = width;
        this.grid = [] // 2d-array i.e. [undefined, [undefined, Robot]] is Robot at co-ord 0,1
        this.scent = [] // 2d-array i.e.  // [x1][y1] = { 'x2_y2': Occupant }
    }

    /**
     * @param location { Coords } }
     */
    removeOccupant( location ){
        this.grid[location[0]][location[1]] = undefined;
        return true
    }

    /**
     * @param occupant { Occupant }
     * @param location { Coords } }
     */
    addOccupant(occupant, location ){
        if (!occupant) return false; // occupant is required
        if (this.getOccupant(location)) return false; // can not put two occupants on same square [assumption!]
        if (typeof this.grid[location[0]] === 'undefined') this.grid[location[0]] = []; // ensure array is initialised
        this.grid[location[0]][location[1]] = occupant;
        return true
    }

    /**
     * @param location { Coords }
     * @returns boolean
     */
    isOffGrid([x, y]) {
        return x > this.width || y > this.height
    }

    /**
     * @param location { Coords }
     * @returns Occupant | Undefined
     */
    getOccupant([x, y]) {
        return this.grid[x]?.[y]
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
     * @param from { Coords }
     * @param to { Coords }
     * @returns Boolean
     */
    moveOccupant(from, to) {
        const occupant = this.getOccupant(from);
        if (!occupant) return false;

        const wasAdded = this.addOccupant(occupant, to)
        if (!wasAdded) return false

        this.removeOccupant(from); // only remove occupant from original location

        if (this.isOffGrid(to)) {  // lost
            this.addScent(occupant, from, to);
            this.removeOccupant(to);  // only remove occupant from new location as it is 'lost'
        }
        return true;
    }
}
