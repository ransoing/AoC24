import { outputAnswers } from '../output-answers';
import { parseIntegers } from '../util/parse';

function solve( input: string, solvePart2 = false ) {
    const blocks = input.split( '\n\n' ).map(
        block => block.split('\n').map( line => parseIntegers(line) )
    );
    const [ rules, updates ] = blocks;
    let sums = { correctlyOrdered: 0, incorrectlyOrdered: 0 };

    updates.forEach( update => {
        // determine if this update is already in the right order, or if the ordering does not have a matching rule
        if (
            rules.every( rule => {
                const i0 = update.indexOf( rule[0] );
                const i1 = update.indexOf( rule[1] );
                return i0 < i1 || i0 === -1 || i1 === -1;
            })
        ) {
            // add the middle value to the sum of correctly ordered updates
            sums.correctlyOrdered += update[(update.length-1) / 2];
        } else {
            // sort the update based on the rules
            update.sort( (a, b) => {
                const rule = rules.find( rule => rule.includes(a) && rule.includes(b) );
                return rule == null || rule[0] === a ? 1 : -1;
            });
            // add the middle value to the sum of incorrectly ordered updates
            sums.incorrectlyOrdered += update[(update.length-1) / 2]
        }
    });

    return solvePart2 ? sums.incorrectlyOrdered : sums.correctlyOrdered;
}


outputAnswers({
    part1: {
        solver: ( input: string ) => solve( input ),
        exptectedExampleSolution: 143,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => solve( input, true ),
        exptectedExampleSolution: 123,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    }
});
