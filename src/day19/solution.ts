import { memoize, sum } from 'lodash';
import { outputAnswers } from '../output-answers';

function solve( input: string, part1 = true ) {
    const blocks = input.split( '\n\n' ).map( block => block.split('\n') );
    const towels = blocks[0][0].split( ', ' );
    const memoizedCountCombos = memoize( countCombos );

    // for part 1, return the number of patterns that have > 0 combos. For part 2, return the total number of all combos
    return part1 ?
        blocks[1].filter( target => memoizedCountCombos(target) ).length :
        sum( blocks[1].map( target => memoizedCountCombos(target) ) );

    function countCombos( remaining: string ) {
        return remaining.length === 0 ? 1 : sum(
            towels.map( towel => {
                return remaining.startsWith( towel ) ? memoizedCountCombos( remaining.slice(towel.length) ) : 0;
            })
        );
    }
}

outputAnswers({
    part1: {
        solver: ( input: string ) => solve( input ),
        exptectedExampleSolution: 6,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => solve( input, false ),
        exptectedExampleSolution: 16,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    }
});
