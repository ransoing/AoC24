import { outputAnswers } from '../output-answers';
import { indexesOf, parseAsXyGrid } from '../util/grid';
import { readTextFile } from '../util/parse';
import { XYZ } from '../util/xyz';

function solve( input: string, solvePart2 = false ) {
    const grid = parseAsXyGrid( input );
    // find the starting position, marked by '^'
    let startPosition = new XYZ( indexesOf('^', grid) );
    // turn that spot into a floor space so we can travel through it
    startPosition.setValueIn( grid, '.' );
    
    const result = travel( grid, startPosition );

    if ( !solvePart2 ) {
        return result.visitedPoints.size;
    }

    // for each location that the guard visits (not the start location), put a new obstacle there to see if the guard gets stuck in a loop
    result.visitedPoints.delete( startPosition.toString() );
    return Array.from( result.visitedPoints ).filter( point => {
        const p = XYZ.fromString( point );
        // turn this spot into a wall
        p.setValueIn( grid, '#' );
        const { escaped } = travel( grid, startPosition );
        // turn the spot back into a floor space for the next loop
        p.setValueIn( grid, '.' );
        return !escaped;
    }).length;
}

/** makes a guard travel from a start point until the guard either loops or escapes the map. */
function travel( grid: string[][], start: XYZ ): { visitedPoints: Set<string>; escaped: boolean } {
    let position = start.copy();
    let direction = XYZ.yPositive;
    const visitedPoints = new Set<string>([ position.toString() ]);
    const visitedStates = new Set<string>([ `${position}|${direction}` ]);
    let escaped = true;

    while ( true ) {
        const nextStep = position.plus( direction );
        if ( nextStep.valueIn(grid) === '.' ) {
            position = nextStep;
            const stateKey = `${position}|${direction}`;
            if ( visitedStates.has(stateKey) ) {
                // we're stuck in a loop. quit now
                escaped = false;
                break;
            }
            visitedPoints.add( position.toString() );
            visitedStates.add( stateKey );
        } else if ( nextStep.valueIn(grid) === '#' ) {
            // turn right
            direction = direction.rotatedClockwise();
        } else {
            break;
        }
    }

    return { visitedPoints, escaped };
}

outputAnswers(
    // function that solves part 1
    ( input: string ) => solve( input ),
    // function that solves part 2
    ( input: string ) => solve( input, true ),

    readTextFile( `${__dirname}/example-input` ),
    readTextFile( `${__dirname}/full-input` ),
    readTextFile( `${__dirname}/example-input` ),
    readTextFile( `${__dirname}/full-input` )
);
