import { memoize, sum } from 'lodash';
import { NO_EXPECTED_EXAMPLE_SOLUTION, outputAnswers } from '../output-answers';
import { parseAsXyGrid } from '../util/grid';
import { parseIntegers } from '../util/parse';
import { XYZ } from '../util/xyz';

function solve( input: string, numDirectionKeypadBots: number ) {
    const codes = input.split( '\n' );

    const getXyzMap = ( gridstring: string ) => new Map<string, XYZ>(
        parseAsXyGrid( gridstring ).flatMap( (col, x) => col.map( (label, y) => [ label, new XYZ([x, y]) ] ) )
    );
    const numericXYZs = getXyzMap( '789\n456\n123\n 0A' );
    const directionXYZs = getXyzMap( ' ^A\n<v>' );
    const xyzDirsToArrowDirs: { [key: string]: string } = {
        '1,1,0'  : '>^',
        '1,-1,0' : '>v',
        '-1,1,0' : '<^',
        '-1,-1,0': '<v',
        '1,0,0'  : '>',
        '0,1,0'  : '^',
        '-1,0,0' : '<',
        '0,-1,0' : 'v'
    };

    const memoizedNumDirectionBot1Steps = memoize( numDirectionBot1Steps, (a: string, b: number) => `${a},${b}` );
    const memoizedNumDirectionBot2Steps = memoize( numDirectionBot2Steps );

    return sum(
        codes.map( code => {
            const minLength = sum(
                code.split( '' ).map( (toDigit, i) => {
                    // from one digit being entered to the next, the other robots have reset their positions to 'A', so we don't need to consider
                    // the states of the other robots at this point
                    const fromDigit = i === 0 ? 'A' : code[i - 1];
                    // the fastest path involves as few direction changes as possible, so if we're moving from one row and column to a different
                    // row and column, there are only really two possible choices, i.e. >>>vv or vv>>>, and never >v>v>.
                    // To allow memoization, we only need to focus on what directions we're moving, not the distance.
                    // This concept applies to all layers of robots.
                    const [ fromPoint, toPoint ] = [ numericXYZs.get(fromDigit), numericXYZs.get(toDigit) ];
                    let possibilities: string[] = []
                    // don't include possibilities that involve moving over the empty space
                    if ( 'A0'.includes(fromDigit) && '741'.includes(toDigit) ) {
                        possibilities.push( '^<' );
                    } else if ( 'A0'.includes(toDigit) && '741'.includes(fromDigit) ) {
                        possibilities.push( '>v' );
                    } else {
                        const arrowDirs = xyzDirsToArrowDirs[ toPoint.minus(fromPoint).toSign().toString() ];
                        possibilities.push( arrowDirs );
                        // if we're moving in both the x and y directions, we can move x then y, or y then x
                        if ( arrowDirs.length > 1 ) {
                            possibilities.push( arrowDirs.split('').reverse().join('') );
                        }
                    }

                    // return the count of whichever possibility results in fewer steps.
                    // Plus one for the extra button push that results in the direction bot pushing a direction
                    return Math.min(
                        ...possibilities.map( possibility => memoizedNumDirectionBot1Steps(possibility, numDirectionKeypadBots) )
                    ) + fromPoint.taxicabDistanceTo( toPoint ) + 1;
                })
            );

            return parseIntegers( code )[0] * minLength;
        })
    );


    function numDirectionBot1Steps( arrowDirs: string, numBotsLeft: number ) {
        return sum(
            `${arrowDirs}A`.split( '' ).map( (toDigit, i) => {
                const fromDigit = i === 0 ? 'A' : arrowDirs[i - 1];
                const [ fromPoint, toPoint ] = [ directionXYZs.get(fromDigit), directionXYZs.get(toDigit) ];
                let possibilities: string[] = [];
                // don't include the possibilities that involve moving over empty space
                if ( '^A'.includes(fromDigit) && toDigit === '<' ) {
                    possibilities.push( 'v<' );
                } else if ( fromDigit === '<' && '^A'.includes(toDigit) ) {
                    possibilities.push( '>^' );
                } else {
                    const dirs = xyzDirsToArrowDirs[ toPoint.minus(fromPoint).toSign().toString() ];
                    possibilities.push( dirs );
                    // if we're moving in both the x and y directions, we can move x then y, or y then x
                    if ( dirs.length > 1 ) {
                        possibilities.push( dirs.split('').reverse().join('') );
                    }
                }

                // return the count of whichever possibility results in fewer steps
                if ( numBotsLeft === 2 ) {
                    return Math.min(
                        ...possibilities.map( possibility => memoizedNumDirectionBot2Steps(possibility) )
                    ) + fromPoint.taxicabDistanceTo( toPoint );
                } else {
                    return Math.min(
                        ...possibilities.map( possibility => memoizedNumDirectionBot1Steps(possibility, numBotsLeft - 1) )
                    ) + fromPoint.taxicabDistanceTo( toPoint );
                }
            })
        );
    }


    function numDirectionBot2Steps( arrowDirs: string ) {
        return sum(
            `${arrowDirs}A`.split( '' ).map( (arrowDir, i) => {
                const fromDigit = i === 0 ? 'A' : arrowDirs[i - 1];
                const [ fromPoint, toPoint ] = [ directionXYZs.get(fromDigit), directionXYZs.get(arrowDir) ];
                return fromPoint.taxicabDistanceTo( toPoint );
            })
        );
    }

}

outputAnswers({
    part1: {
        solver: ( input: string ) => solve( input, 2 ),
        exptectedExampleSolution: 126384,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => solve( input, 25 ),
        exptectedExampleSolution: NO_EXPECTED_EXAMPLE_SOLUTION,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    }
});
