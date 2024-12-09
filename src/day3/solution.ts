import { sum } from 'lodash';
import { outputAnswers } from '../output-answers';
import { product } from '../util/math';
import { parseIntegers } from '../util/parse';

function solve( input: string ) {
    return sum(
        input.match( /mul\(\d+,\d+\)/g ).map(
            match => product( ...parseIntegers(match) )
        )
    );
}

function solve2( input: string ) {
    // grab segments between 'do()' and 'don't()', but also account for the start and end of the string and how a starting 'do()' is implied
    const validSegments = input.match( /(^.*?don\'t\(\))|(do\(\).*?($|don't\(\)))/gs );
    return sum(
        validSegments.map( segment => solve(segment) )
    );
}


outputAnswers({
    part1: {
        solver: ( input: string ) => solve( input ),
        exptectedExampleSolution: 161,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => solve2( input ),
        exptectedExampleSolution: 48,
        exampleInputPath: `${__dirname}/example-input-2`,
        fullInputPath: `${__dirname}/full-input`
    }
});
