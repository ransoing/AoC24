import { outputAnswers } from '../output-answers';
import { parseAsXyGrid } from '../util/grid';
import { XYZ } from '../util/xyz';

function solve( input: string, part2 = false ) {
    const grid = parseAsXyGrid( input );

    const visitedPlots = new Set<string>();

    let regionPriceSum = 0;

    grid.forEach( (col, i) => {
        col.forEach( (cell, j) => {
            // flood fill from here, but first check if we've flood filled this spot
            const plot = new XYZ( [i, j] );
            if ( visitedPlots.has( plot.toString() ) ) {
                return;
            }
            // flood to points with the same value
            const floodResult = plot.floodFill({
                canVisitNeighbor: ( neighbor: XYZ ) => neighbor.valueIn( grid ) === plot.valueIn( grid )
            });

            floodResult.visitedPoints.forEach( point => visitedPlots.add( point.toString() ) );

            // find the perimeter
            let perimeter = 0;

            let perimeterPaths: [ XYZ, XYZ, XYZ ][] = []; // point1 on perimeter, point2 on perimeter, original plot
            floodResult.visitedPoints.forEach( point => {
                const neighbors = point.neighbors();
                neighbors.forEach( neighbor => {
                    if ( neighbor.valueIn(grid) !== point.valueIn(grid) ) {
                        perimeter++;
                        if ( part2 ) {
                            // record a segment of the perimeter, between the plot and the non-plot neighbor
                            if ( neighbor.y === point.y ) {
                                const mid = (neighbor.x + point.x)/2;
                                perimeterPaths.push([ new XYZ([mid, point.y - 0.5]), new XYZ([mid, point.y + 0.5]), point ] );
                            } else {
                                const mid = (neighbor.y + point.y)/2;
                                perimeterPaths.push([ new XYZ([point.x - 0.5, mid]), new XYZ([point.x + 0.5, mid]), point ] );
                            }
                        }
                    }
                });
            });

            if ( !part2 ) {
                regionPriceSum += floodResult.visitedPoints.length * perimeter;
            } else {
                // consolidate the perimeter paths by joining segments that touch and run in the same direction
                let changes: number;
                do {
                    changes = 0;
                    for ( let i = 0; i < perimeterPaths.length; i++ ) {
                        for ( let j = i + 1; j < perimeterPaths.length; j++ ) {
                            const path1 = perimeterPaths[i];
                            const path2 = perimeterPaths[j];
                            const axes = ['x', 'y'];
                            let madeChange = false;
                            for ( let k = 0; k < axes.length; k++ ) {
                                const axis = axes[k];
                                const oppositeAxis = axis === 'x' ? 'y' : 'x';
                                if (
                                    // check that the two paths line up
                                    path1[0][axis] === path1[1][axis] &&
                                    path2[0][axis] === path2[1][axis] &&
                                    path1[0][axis] === path2[1][axis] &&
                                    // check to make sure these two paths touch
                                    (
                                        path1[0][oppositeAxis] === path2[0][oppositeAxis] ||
                                        path1[0][oppositeAxis] === path2[1][oppositeAxis] ||
                                        path1[1][oppositeAxis] === path2[0][oppositeAxis] ||
                                        path1[1][oppositeAxis] === path2[1][oppositeAxis]
                                    ) &&
                                    // check to make sure we're not connecting fences from diagonally-same plots
                                    (
                                        path1[2].x === path2[2].x || path1[2].y === path2[2].y
                                    )
                                ) {
                                    // merge the two paths
                                    path1[0][oppositeAxis] = Math.min( path1[0][oppositeAxis], path2[0][oppositeAxis] );
                                    path1[1][oppositeAxis] = Math.max( path1[1][oppositeAxis], path2[1][oppositeAxis] );
                                    // remove the second path
                                    perimeterPaths.splice( j, 1 );
                                    madeChange = true;
                                }

                            }
                            if ( madeChange ) {
                                j--;
                                changes++;
                                break;
                            }
                        }
                    }
                } while ( changes > 0 );

                regionPriceSum += floodResult.visitedPoints.length * perimeterPaths.length;

            }
        });
    });

    return regionPriceSum;
}

outputAnswers({
    part1: {
        solver: ( input: string ) => solve( input ),
        exptectedExampleSolution: 1930,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => solve( input, true ),
        exptectedExampleSolution: 1206,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    }
});
