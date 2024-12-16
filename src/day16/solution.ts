import { outputAnswers } from '../output-answers';
import { indexesOf, parseAsXyGrid } from '../util/grid';
import { IPathHistoryItem, XYZ } from '../util/xyz';

function solve( input: string, part2 = false ) {
    const grid = parseAsXyGrid( input );

    const start = new XYZ( indexesOf('S', grid) );
    const end = new XYZ( indexesOf('E', grid) );
    [ start, end ].forEach( p => p.setValueIn(grid, '.') );

    let snubbedPaths: { totalWeight: number, history: IPathHistoryItem[] }[] = [];

    const quickestPath = start.quickestPath({
        target: end,
        canVisitNeighbor: (neighbor, from, history) => neighbor.valueIn( grid ) === '.' && !history[history.length - 2]?.point.equals( neighbor ),
        // the state of the traveler depends on the current point and the previous point, i.e. the direction of travel. 
        getStateKey: (p, history) => `${p.toString()}|${history[history.length - 2]?.point.toString() ?? ''}`,
        getPointWeight: (to, history) => {
            const direction = history.length === 0 ? new XYZ([ 1, 0 ]) :
                history[history.length - 1].point.minus( history[history.length - 2]?.point ?? start );
            return to.minus( history[history.length - 1]?.point ?? start ).equals( direction ) ? 1 : 1001;
        },
        onSnubEqualWeightedPath: (history, totalWeight) => {
            if ( part2 ) {
                snubbedPaths.push({ totalWeight, history });
            }
        }
    });

    if ( part2 ) {
        // keeps track of the states/points on all of the fastest paths, and the weight to get there
        const fastestPathPoints = new Map<string, {p: XYZ, weight: number}>();
        quickestPath.history.forEach( p => fastestPathPoints.set(p.stateKey, {p: p.point, weight: p.accumulatedWeight}) );

        let somePathsAdded = false;
        do {
            somePathsAdded = false;
            // some snubbed paths are not the fastest. Loop through all snubbed paths and keep the ones that end at the same state and weight
            // as the fastest paths. Keep looping through until no more paths are kept (the ones remaining are too slow).
            snubbedPaths = snubbedPaths.filter( snubbedPath => {
                const fastestState = fastestPathPoints.get( snubbedPath.history[snubbedPath.history.length - 1].stateKey );
                if ( fastestState != null && fastestState.weight === snubbedPath.totalWeight ) {
                    somePathsAdded = true;
                    snubbedPath.history.forEach( p => fastestPathPoints.set(p.stateKey, {p: p.point, weight: p.accumulatedWeight}) );
                    return false;
                }
                return true;
            });
        } while ( somePathsAdded );

        // return the unique number of points in the visited states, plus 1 for the starting point
        return new Set( Array.from(fastestPathPoints.values()).map(v => v.p.toString()) ).size + 1;
    } else {
        return quickestPath.totalWeight;
    }
    
}

outputAnswers({
    part1: {
        solver: ( input: string ) => solve( input ),
        exptectedExampleSolution: 7036,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => solve( input, true ),
        exptectedExampleSolution: 45,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    }
});
