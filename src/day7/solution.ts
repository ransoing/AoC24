import { curry, sum } from 'lodash';
import { outputAnswers } from '../output-answers';
import { parseIntegers, readTextFile } from '../util/parse';

function solve( input: string, allowConcat = false ) {
    // parse all integer values from each line of input, so each line is just an array of numbers
    const steps = input.split( '\n' ).map( l => parseIntegers(l) );

    function runStep( target: number, nums: number[], runningTotal: number ) {
        // optimize by stopping early if the running total is already too large
        if ( runningTotal > target ) {
            return false;
        }
        if ( nums.length === 0 ) {
            return runningTotal === target;
        }
        // try all combos of operations
        const nextStep = curry( runStep )( target, nums.slice(1) );
        return nextStep( runningTotal + nums[0] ) ||
            nextStep( runningTotal * nums[0] ) ||
            ( allowConcat && nextStep( parseInt(`${runningTotal}${nums[0]}`) ) );
    }

    return sum(
        // brute force combos of operations to see if we can reach the target number
        steps.filter(
            step => runStep( step[0], step.slice(2), step[1] )
        ).map(
            step => step[0]
        )
    );
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
