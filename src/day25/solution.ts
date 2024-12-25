import { outputAnswers } from '../output-answers';
import { parseAsXyGrid } from '../util/grid';

function solve( input: string ) {
    const blocks = input.split( '\n\n' ).map( block => parseAsXyGrid(block) );

    // convert keys and locks to arrays of heights
    const getLengths = ( blocks: string[][][] ) => {
        return blocks.map(
            block => block.map(
                col => Array.from( col.join('').matchAll( /#/g ) ).length
            )
        );
    };
    const keys = getLengths( blocks.filter(block => block[0][0] === '#') );
    const locks = getLengths( blocks.filter(block => block[0][0] !== '#') );
    const maxHeight = blocks[0][0].length;

    let goodCombos = 0;
    // loop through every unique key/lock combination
    for ( let i = 0; i < keys.length; i++ ) {
        for ( let j = 0; j < locks.length; j++ ) {
            const sums = keys[i].map( ( row, rowIndex ) => row + locks[j][rowIndex] );
            if ( sums.every(sum => sum <= maxHeight) ) {
                goodCombos++;
            }
        }
    }
    return goodCombos;
}

outputAnswers({
    part1: {
        solver: ( input: string ) => solve( input ),
        exptectedExampleSolution: 3,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => null,
        exptectedExampleSolution: null,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    }
});
