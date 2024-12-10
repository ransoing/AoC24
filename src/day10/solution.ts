import { range, sum } from 'lodash';
import { outputAnswers } from '../output-answers';
import { indexesOfEvery, parseAsXyGrid } from '../util/grid';
import { XYZ } from '../util/xyz';

function solve( input: string ) {
    const grid = parseAsXyGrid( input, e => parseInt(e) );
    // get positions of all trailheads and sum the score of each
    return sum( indexesOfEvery(0, grid).map( trailheadIndexes => {
        const trailhead = new XYZ( trailheadIndexes );
        // use flood fill to find all 9's we can get to
        const flooded = trailhead.floodFill({
            canVisitNeighbor: (neighbor, p) => neighbor.valueIn( grid ) === p.valueIn( grid ) + 1
        });
        // how many 9's can we access from this trailhead?
        return flooded.visitedPoints.filter( p => p.valueIn( grid ) === 9 ).length;
    }));
}


function solve2( input: string ) {
    const grid = parseAsXyGrid( input, e => parseInt(e) );
    const numPathsToPoint = new Map<string, number>();
    let pointsAtHeight: XYZ[];
    range( 1, 10 ).forEach( height => {
        // find all points at this height
        pointsAtHeight = indexesOfEvery( height, grid ).map( p => new XYZ(p) );
        // sum the `numPathsToPoint` of adjacent points with height - 1, assuming points with height 0 have 1 path
        pointsAtHeight.forEach( point => {
            const neighbors = point.neighbors().filter( n => n.valueIn(grid) === height - 1 );
            numPathsToPoint.set(
                point.toString(),
                sum( neighbors.map( n => numPathsToPoint.get(n.toString()) ?? 1 ) )
            );
        });
    });
    // sum the number of paths to each 9
    return sum(
        pointsAtHeight.map( p => numPathsToPoint.get(p.toString()) )
    );
}


outputAnswers({
    part1: {
        solver: ( input: string ) => solve( input ),
        exptectedExampleSolution: 36,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => solve2( input ),
        exptectedExampleSolution: 81,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    }
});
