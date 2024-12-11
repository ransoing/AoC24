import { memoize, sum } from 'lodash';
import { NO_EXPECTED_EXAMPLE_SOLUTION, outputAnswers } from '../output-answers';
import { parseIntegers } from '../util/parse';

function solve( input: string, totalBlinks: number ) {
    const stones = parseIntegers( input );
    return sum( stones.map( stone => memoizedNumberOfStones(stone, totalBlinks) ) );
}

function totalNumberOfStones( num: number, blinks: number ) {
    if ( blinks === 0 ) {
        return 1;
    } else if ( num === 0 ) {
        return memoizedNumberOfStones( 1, blinks - 1 );
    } else {
        const numString = num.toString();
        if ( numString.length % 2  === 0 ) {
            return memoizedNumberOfStones( parseInt(numString.substring(0, numString.length/2)), blinks - 1 ) +
                memoizedNumberOfStones( parseInt(numString.substring(numString.length/2)), blinks - 1 );
        } else {
            return memoizedNumberOfStones( num * 2024, blinks - 1 );
        }
    }
}

const memoizedNumberOfStones = memoize( totalNumberOfStones, (num, blinks) => `${num},${blinks}` );

outputAnswers({
    part1: {
        solver: ( input: string ) => solve( input, 25 ),
        exptectedExampleSolution: 55312,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => solve( input, 75 ),
        exptectedExampleSolution: NO_EXPECTED_EXAMPLE_SOLUTION,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    }
});
