import { outputAnswers } from '../output-answers';
import { indexesOf, parseAsXyGrid } from '../util/grid';
import { XYZ } from '../util/xyz';

function solve( input: string, maxCheatLength: number, testMinSavings: number ) {
    const grid = parseAsXyGrid( input );
    // what is the minimum number of picoseconds saved that we're testing for? This is different for the test vs full input
    const minSavings = grid.length > 20 ? 100 : testMinSavings;
    // get S and E
    const [ start, end ] = [ 'S', 'E' ].map( letter => new XYZ( indexesOf(letter, grid) ) );
    [ start, end ].forEach( point => point.setValueIn(grid, '.') );

    // for each point in the maze, record how many steps it takes to get to the point, and how many it takes to get from there to the end
    const distances = new Map<string, { toPoint: number, toEnd: number }>();
    const quickest = start.quickestPath({
        target: end,
        canVisitNeighbor: n => n.valueIn( grid ) === '.'
    });
    const path = [ start, ...quickest.history.map(p => p.point) ];
    path.forEach( (point, i) => {
        distances.set( point.toString(), {
            toPoint: i,
            toEnd: path.length - i
        });
    });

    let numGoodCheats = 0; // the number of cheats that save us at least `testMinSavings` steps
    // for each spot on the path, find other spots farther down the path that can be gotten to within the max cheat length and discover the
    // cheat savings
    for ( let i = 0; i < path.length; i++ ) {
        // only check the points further down that path that are `minSavings` steps away, because we're only interested in the cheats that
        // save that many steps
        for ( let j = i + minSavings; j < path.length; j++ ) {
            const taxiDistance = path[j].taxicabDistanceTo( path[i] );
            if ( taxiDistance <= maxCheatLength ) {
                // calculate the savings from the cheat
                const totalDistanceWithCheat = distances.get(path[i].toString()).toPoint + distances.get(path[j].toString()).toEnd + taxiDistance;
                if ( path.length - totalDistanceWithCheat >= minSavings ) {
                    numGoodCheats++;
                }
            }
        }
    }

    return numGoodCheats;
}

outputAnswers({
    part1: {
        solver: ( input: string ) => solve( input, 2, 12 ),
        exptectedExampleSolution: 8,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => solve( input, 20, 74 ),
        exptectedExampleSolution: 7,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    }
});