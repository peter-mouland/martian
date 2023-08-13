/*
  class Grid
  purpose: to serve as a mechanism to set 'bounds'
*/

export class Grid {

    /**
     * @typedef {array<number, number>} Coords
     * @description [x,y]
     */
    /**
     * @typedef {array<number, number>} GridSize
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
    }

    /**
     * @param location { Coords }
     * @returns boolean
     */
    isOffGrid([x, y]) {
        return x > this.width || y > this.height
    }
}
