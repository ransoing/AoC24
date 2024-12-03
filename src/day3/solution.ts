import { sum } from 'lodash';
import { outputAnswers } from '../output-answers';
import { product } from '../util/math';
import { parseIntegers, readTextFile } from '../util/parse';

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

outputAnswers(
    // function that solves part 1
    ( input: string ) => solve( input ),
    // function that solves part 2
    ( input: string ) => solve2( input ),

    readTextFile( `${__dirname}/example-input` ),
    readTextFile( `${__dirname}/full-input` ),
    readTextFile( `${__dirname}/example-input-2` ),
    readTextFile( `${__dirname}/full-input` )
);
