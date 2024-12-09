import { outputAnswers } from '../output-answers';
import { indexesOfEvery, parseAsXyGrid } from '../util/grid';
import { XYZ } from '../util/xyz';

function solve( input: string, solvePart2 = false ) {
    const grid = parseAsXyGrid( input );

    // scan the grid to find all the unique antenna letter/number labels
    const labels = new Set<string>();
    grid.forEach( (col, x ) => {
        col.forEach( (cell, y) => {
            if ( cell !== '.' ) {
                labels.add( cell );
            }
        });
    });

    const antinodeLocations = new Set<string>();
    Array.from( labels ).forEach( label => {
        const labelLocations = indexesOfEvery( label, grid );
        labelLocations.forEach( (location, i) => {
            // compare with every other instance of this label to create an antinode
            labelLocations.forEach( otherLocation => {
                if ( location === otherLocation ) {
                    return;
                }

                const diff = new XYZ( otherLocation ).minus( location );
                if ( !solvePart2 ) {
                    // place an antinode at 2x the distance from the current location to the other location
                    const antinode = new XYZ( location ).plus( diff.times(2) );
                    // we can only place antinodes within the grid, so check if it's in bounds
                    if ( antinode.valueIn(grid) != null ) {
                        antinodeLocations.add( antinode.toString() );
                    }
                } else {
                    // place antinodes in both directions at the frequency of the difference between the two locations (including this location)
                    antinodeLocations.add( new XYZ(location).toString() );
                    // create antinodes until we run off one edge of the grid. Do this in both directions (adding and subtracting)
                    [ XYZ.prototype.add, XYZ.prototype.subtract ].forEach( operation => {
                        let antinode: XYZ = operation.call( new XYZ(location), diff );
                        while ( antinode.valueIn(grid) != null ) {
                            antinodeLocations.add( antinode.toString() );
                            operation.call( antinode , diff );
                        }
                    });
                }
            });
        });
    });

    return antinodeLocations.size;
}


outputAnswers({
    part1: {
        solver: ( input: string ) => solve( input ),
        exptectedExampleSolution: 14,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => solve( input, true ),
        exptectedExampleSolution: 34,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    }
});
