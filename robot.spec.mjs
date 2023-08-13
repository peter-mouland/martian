import assert from 'node:assert/strict';
import test from 'node:test';

import { Robot } from './robot.mjs'

test('Robot default init', () => {
    const coords = [0,0];
    const direction = 'N';
    const robot = new Robot(coords, direction)
    assert.strictEqual(robot.directionDeg, robot.DirectionDeg[direction])
    assert.strictEqual(robot.status, robot.Status.onMission)
    assert.strictEqual(robot.path.length, 1)
    assert.deepEqual(robot.path[0], coords)
});
test('Robot can get set as lost', () => {
    const robot1 = new Robot([0,0], 'N')
    robot1.setIsLost()
    assert.deepEqual(robot1.isLost(), true)
    assert.deepEqual(robot1.status, robot1.Status.lost)
    assert.deepEqual(robot1.getStatus(), 'LOST')
});

test('Robot calculateNewCoords() translates movement F and a given direction into new coords', () => {
    const robot1 = new Robot([0,0], 'N')
    assert.deepEqual(robot1.calculateNewCoords('F'), [0, 1])

    const robot2 = new Robot([0,0], 'E')
    assert.deepEqual(robot2.calculateNewCoords('F'), [1, 0])

    const robot3 = new Robot([0,0], 'S')
    assert.deepEqual(robot3.calculateNewCoords('F'), [0, -1])

    const robot4 = new Robot([0,0], 'W')
    assert.deepEqual(robot4.calculateNewCoords('F'), [-1, 0])
});

test('Robot turn()', async (t) => {
    await t.test('translates direction N and a given turn into new direction', () => {
        const robot1 = new Robot([0,0], 'N')
        assert.strictEqual(robot1.turn('L'), true)
        assert.strictEqual(robot1.directionDeg, 270)
        assert.strictEqual(robot1.getDirection(), 'W')

        const robot2 = new Robot([0,0], 'N')
        assert.strictEqual(robot2.turn('R'), true)
        assert.strictEqual(robot2.directionDeg, 90)
        assert.strictEqual(robot2.getDirection(), 'E')
    });
    await t.test('translates direction E and a given turn into new direction', () => {
        const robot1 = new Robot([0,0], 'E')
        assert.strictEqual(robot1.turn('L'), true)
        assert.strictEqual(robot1.directionDeg, 0)
        assert.strictEqual(robot1.getDirection(), 'N')

        const robot2 = new Robot([0,0], 'E')
        assert.strictEqual(robot2.turn('R'), true)
        assert.strictEqual(robot2.directionDeg, 180)
        assert.strictEqual(robot2.getDirection(), 'S')
    });
    await t.test('translates direction S and a given turn into new direction', () => {
        const robot1 = new Robot([0,0], 'S')
        assert.strictEqual(robot1.turn('L'), true)
        assert.strictEqual(robot1.directionDeg, 90)
        assert.strictEqual(robot1.getDirection(), 'E')

        const robot2 = new Robot([0,0], 'S')
        assert.strictEqual(robot2.turn('R'), true)
        assert.strictEqual(robot2.directionDeg, 270)
        assert.strictEqual(robot2.getDirection(), 'W')
    });
    await t.test('translates direction W and a given turn into new direction', () => {
        const robot1 = new Robot([0,0], 'W')
        assert.strictEqual(robot1.turn('L'), true)
        assert.strictEqual(robot1.directionDeg, 180)
        assert.strictEqual(robot1.getDirection(), 'S')

        const robot2 = new Robot([0,0], 'W')
        assert.strictEqual(robot2.turn('R'), true)
        assert.strictEqual(robot2.directionDeg, 0)
        assert.strictEqual(robot2.getDirection(), 'N')
    });
    await t.test('does nothing if robot is lost', () => {
        const robot1 = new Robot([0,0], 'N')
        robot1.setIsLost()
        assert.strictEqual(robot1.turn('L'), false)
        assert.strictEqual(robot1.directionDeg, 0)
        assert.strictEqual(robot1.getDirection(), 'N')
    });
});



test('Robot move()', async (t) => {
    await t.test('translates direction N and a given Turn into a new turn Direction', () => {
        const robot1 = new Robot([0,0], 'N')
        assert.strictEqual(robot1.move('L'), true)
        assert.strictEqual(robot1.directionDeg, 270)
        assert.strictEqual(robot1.getDirection(), 'W')
        assert.deepEqual(robot1.getLocation(), [0,0])

        const robot2 = new Robot([0,0], 'N')
        assert.strictEqual(robot2.move('R'), true)
        assert.strictEqual(robot2.directionDeg, 90)
        assert.strictEqual(robot2.getDirection(), 'E')
        assert.deepEqual(robot2.getLocation(), [0,0])
    });
    await t.test('translates direction N and a given movement into a new path coord', () => {
        const robot1 = new Robot([0,0], 'N')
        assert.strictEqual(robot1.move('F'), true)
        assert.strictEqual(robot1.directionDeg, 0)
        assert.strictEqual(robot1.getDirection(), 'N')
        assert.deepEqual(robot1.getLocation(), [0,1])
    });
    await t.test('does nothing if robot is lost', () => {
        const robot1 = new Robot([0,0], 'N')
        robot1.setIsLost()
        assert.deepEqual(robot1.move('L'), false)
        assert.strictEqual(robot1.directionDeg, 0)
        assert.strictEqual(robot1.getDirection(), 'N')
        assert.deepEqual(robot1.getLocation(), [0,0])
    });
    await t.test('does nothing if validation fails', () => {
        const robot1 = new Robot([0,0], 'N')
        assert.strictEqual(robot1.move('F', () => false), false)
        assert.strictEqual(robot1.directionDeg, 0)
        assert.strictEqual(robot1.getDirection(), 'N')
        assert.deepEqual(robot1.getLocation(), [0,0])
    });
});
