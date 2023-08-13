export const convert = (input) => {
    const robots = [];
    const lines = input.trim().split('\n')

    /**
     * @type array<Coords>
     */
    const gridSize = lines.shift().split(' ').map((coord) => parseInt(coord, 10))

    lines.forEach((line, i) => {
        if (i%3 ===0) {
            const [x, y, d] = line.trim().split(' ')
            robots.push({ coords: [parseInt(x, 10), parseInt(y, 10)], direction: d})
        }
        if (i%3 ===1) {
            robots.at(-1).instructions = line.trim().split('')
        }
    })

    return { gridSize, robots }
}
