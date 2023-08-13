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

const controller = new Controller({ debug: false })
controller.initGrid(input.gridSize)
input.robots.forEach((robot) => {
    const robot1 = controller.addRobot(robot)
    robot1.move(robot.instructions)
})

controller.report()
