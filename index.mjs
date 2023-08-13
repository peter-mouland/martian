import { Controller } from './controller.mjs'
import { convert } from './utils/instructions-str-converter.mjs'

const exampleInput = `
5 3
1 1 E
RFRFRFRF

3 2 N
FRRFLLFFRRFLL

0 3 W
LLFFFLFLFL
`

const input = convert(exampleInput);

const controller = new Controller(input.gridSize, { debug: false });
input.robots.forEach((r) => {
    const robot = controller.addRobot(r);
    controller.move(robot, r.instructions);
})

controller.report()
