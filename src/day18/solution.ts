import { outputAnswers } from '../output-answers';
import { parseIntegers } from '../util/parse';
import { XYZ } from '../util/xyz';
import { findInsertIndexBinary } from '../util/search';

function solve( input: string, part2 = false ) {
    let coords: XYZ[] = input.split( '\n' ).map( l => new XYZ(parseIntegers(l)) );

    const maxX = Math.max( ...coords.map( c => c.x ) );
    const maxY = Math.max( ...coords.map( c => c.y ) );

    if ( !part2 ) {
        // use `coords.length` to check whether we're solving for the test case or the full input
        // for part 1, only consider the first 12 or 1024 coordinates as walls
        const walls = new Set( coords.slice( 0, coords.length < 100 ? 12 : 1024 ).map(c => c.toString()) );
        return getShortestPath( maxX, maxY, walls ).history.length;
    } else {
        // run a binary search to find the first coordinate that causes no valid path when it and all the coordinates before it are
        // treated as walls
        const thresholdIndex = findInsertIndexBinary( coords, (coord, i) => {
            const walls = new Set( coords.slice(0, i + 1).map(c => c.toString()) );
            // search lower if there is no valid path, higher if there is a valid path
            return getShortestPath( maxX, maxY, walls ).history.length === 0 ? -1 : 1;
        });
        return `${coords[thresholdIndex].x},${coords[thresholdIndex].y}`;
    }
}

function getShortestPath( maxX: number, maxY: number, walls: Set<string> ) {
    return new XYZ([ 0, 0 ]).shortestPath({
        target: new XYZ([ maxX, maxY ]),
        canVisitNeighbor: ( n: XYZ ) => n.x >= 0 && n.y >= 0 && n.x <= maxX && n.y <= maxY && !walls.has( n.toString() )
    });
}

outputAnswers({
    part1: {
        solver: ( input: string ) => solve( input ),
        exptectedExampleSolution: 22,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => solve( input, true ),
        exptectedExampleSolution: '6,1',
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    }
});
