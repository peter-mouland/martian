import assert from 'node:assert/strict';
import test from 'node:test';

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

test('example input works e2e', () => {
    const log = console.log
    console.log = () => {}
    assert.strictEqual(controller.report(), `1 1 E\n3 3 N LOST\n2 3 S`)
})
