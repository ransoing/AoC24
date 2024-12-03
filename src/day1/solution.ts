import { sum } from 'lodash';
import { outputAnswers } from '../output-answers';
import { parseIntegers, readTextFile } from '../util/parse';

function solve( input: string, part2 = false ) {
    const grid = input.split( '\n' ).map( line => parseIntegers(line) );
    const sortCol = index => grid.map( row => row[index] ).sort( (a, b) => a - b );
    const cols = [ sortCol(0), sortCol(1) ];

    return !part2 ?
        sum(
            // difference between the number in the left column vs the right column
            cols[0].map( (v, i) => Math.abs(v - cols[1][i]) )
        ) :
        sum(
            // the number in the left column times the number of occurrences of that number in the right column
            cols[0].map( (v, i) => v * cols[1].filter( w => w === v ).length )
        )
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
