import { sum } from 'lodash';
import { NO_EXPECTED_EXAMPLE_SOLUTION, outputAnswers } from '../output-answers';
import { parseIntegers } from '../util/parse';
const nerdamer = require( 'nerdamer/all.min' );

function solve( input: string, part2 = false ) {
    const buttonPushPrices = [ 3, 1 ];

    return sum(
        input.split( '\n\n' ).map( block => {
            // buttonA = lines[0], buttonB = lines[1], prize = lines[2]. Each line is parsed as 2 integers
            const lines = block.split( '\n' ).map( line => parseIntegers(line) );
            if ( part2 ) {
                // modify the prize requirements for part 2
                lines[2] = lines[2].map( n => n + 10000000000000 );
            }
            // we can find the number of button presses required by solving a system of linear equations.
            // Unless the two equations are equivalent, there will be a single solution. Fortunately, the puzzle has no cases
            // where the two equations are equivalent.
            const solution = nerdamer.solveEquations([
                `${lines[0][0]}a + ${lines[1][0]}b = ${lines[2][0]}`,
                `${lines[0][1]}a + ${lines[1][1]}b = ${lines[2][1]}`
            ]);
            // the solution is stored as, i.e. `[ [ 'a', 80 ], [ 'b', 40 ] ]`
            const numPresses: number[] = solution.map( s => s[1] );
            // ensure that the number of presses for both `a` and `b` are positive integers
            if ( numPresses.every(n => Number.isInteger(n) && n > 0) ) {
                // return the number of tokens spent
                return numPresses[0] * buttonPushPrices[0] + numPresses[1] * buttonPushPrices[1];
            } else {
                // not possible to win this claw machine - no tokens spent
                return 0;
            }
        })
    );
}

outputAnswers({
    part1: {
        solver: ( input: string ) => solve( input ),
        exptectedExampleSolution: 480,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => solve( input, true ),
        exptectedExampleSolution: NO_EXPECTED_EXAMPLE_SOLUTION,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    }
});
