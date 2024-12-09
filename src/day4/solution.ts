import { range } from 'lodash';
import { outputAnswers } from '../output-answers';
import { parseAsXyGrid } from '../util/grid';
import { XYZ } from '../util/xyz';

function solve( input: string ) {
    const grid = parseAsXyGrid( input );
    let count = 0;
    grid.forEach( (col, x) => {
        col.forEach( (_, y) => {
            const coord = new XYZ([x, y]);
            // search for 'XMAS' going in all directions from this point
            XYZ.orthogonalDirections2D.concat( XYZ.diagonalDirections2D ).forEach( direction => {
                if (
                    range( 0, 4 ).every(
                        scalar => coord.plus( direction.times(scalar) ).valueIn( grid ) === 'XMAS'[scalar]
                    )
                ) {
                    count++;
                }
            });
        });
    });

    return count;
}

function solve2( input: string ) {
    const grid = parseAsXyGrid( input );
    // a map of XYZ.toString() => number of times that the given XYZ is at the center of a single diagonal 'MAS'
    const centerCounts = new Map<string,number>();
    grid.forEach( (col, x) => {
        col.forEach( (_, y) => {
            const coord = new XYZ([x, y]);
            XYZ.diagonalDirections2D.forEach( direction => {
                if (
                    // check that 'MAS' runs diagonally from this point
                    range( 0, 3 ).every(
                        scalar => coord.plus( direction.times(scalar) ).valueIn( grid ) === 'MAS'[scalar]
                    )
                ) {
                    // increment the count of how many times the 'A' is at the center of a diagonal 'MAS'
                    const center = new XYZ([x, y]).plus( direction );
                    centerCounts.set( center.toString(), (centerCounts.get(center.toString()) ?? 0) + 1 );
                }
            });
        });
    });

    // return the number of points which are at the center of exactly 2 diagonal 'MAS'
    return Array.from( centerCounts.values() ).filter( count => count === 2 ).length;
}


outputAnswers({
    part1: {
        solver: ( input: string ) => solve( input ),
        exptectedExampleSolution: 18,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => solve2( input ),
        exptectedExampleSolution: 9,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    }
});
