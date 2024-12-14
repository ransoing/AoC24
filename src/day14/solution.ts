import { range } from 'lodash';
import { NO_EXPECTED_EXAMPLE_SOLUTION, outputAnswers } from '../output-answers';
import { parseIntegers } from '../util/parse';
import { XYZ } from '../util/xyz';
import { product } from '../util/math';
import { displayGrid, replaceEachInGrid, rotateGridClockwise } from '../util/grid';

function solve(input: string, part2 = false) {
    const bots = input.split('\n').map(line => {
        const ints = parseIntegers(line);
        return {
            p: new XYZ([ints[0], ints[1]]),
            v: new XYZ([ints[2], ints[3]])
        };
    });

    // find width and height of grid
    const width = Math.max(...bots.map(bot => bot.p.x)) + 1;
    const height = Math.max(...bots.map(bot => bot.p.y)) + 1;

    // keep track of how many bots are at each spot in the grid
    const grid = range(0, width).map(x => range(0, height).map(y => 0));
    bots.forEach(bot => grid[bot.p.x][bot.p.y]++);

    function step() {
        // move every bot and have it wrap around if necessary. For part 2, update the bot counts in the grid
        bots.forEach(bot => {
            if (part2) grid[bot.p.x][bot.p.y]--;
            bot.p.x = (bot.p.x + bot.v.x + width) % width;
            bot.p.y = (bot.p.y + bot.v.y + height) % height;
            if (part2) grid[bot.p.x][bot.p.y]++;
        });
    }

    // 10000 is a guess for part2... just something less than an infinite loop
    for (let i = 0; i < (part2 ? 10000 : 100); i++) {
        step();

        if (part2) {
            if ((i + 1) % 1000 === 0) {
                console.log(`Still searching for a picture. Number of steps run: ${i + 1}`);
            }
            // check if there's a picture of a christmas tree, by flood filling the middle point. A picture will probably have either
            // a solid outline or be filled in, and will be centered in the middle of the grid. So a flood fill from the center should
            // reach more than jut a few points, but significantly less than the average number of empty points at each step.
            const middle = new XYZ([Math.round(width / 2), Math.round(height / 2)]);
            const flooded = middle.floodFill({
                // check if they are either both 0's or both non-0's
                canVisitNeighbor: (neighbor, p) => neighbor.valueIn(grid) != null && !!neighbor.valueIn(grid) === !!p.valueIn(grid)
            });
            // `10` is just a guess as to the minimum number of points that should be accessible via a flood fill from the middle of a picture
            if (flooded.visitedPoints.length > 10 && flooded.visitedPoints.length < (width * height - bots.length) * .9) {
                displayGrid(rotateGridClockwise(replaceEachInGrid(grid, el => el === 0 ? '.' : '▩')));
                return i + 1;
            }
        }
    }

    // count the bots in each quadrant
    const counts = [0, 0, 0, 0];
    bots.forEach(bot => {
        // ignore bots in the middle row and column
        const [middleRow, middleColumn] = [(height - 1) / 2, (width - 1) / 2];
        if (bot.p.x === middleColumn || bot.p.y === middleRow) {
            return;
        }
        const quad = (bot.p.x < middleColumn ? 0 : 1) + (bot.p.y < middleRow ? 0 : 2);
        counts[quad]++;
    });

    return product(...counts);
}

outputAnswers({
    part1: {
        solver: (input: string) => solve(input),
        exptectedExampleSolution: 12,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: (input: string) => solve(input, true),
        exptectedExampleSolution: NO_EXPECTED_EXAMPLE_SOLUTION,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    }
});
