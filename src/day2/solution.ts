import { range } from 'lodash';
import { outputAnswers } from '../output-answers';
import { parseIntegers } from '../util/parse';

function solve( input: string ) {
    const reports = input.split( '\n' ).map( line => parseIntegers(line) );
    return reports.filter( reportIsSafe ).length;
}

function solve2( input: string ) {
    const reports = input.split( '\n' ).map( line => parseIntegers(line) );
    return reports.filter( report => {
        if ( reportIsSafe(report) ) {
            return true;
        } else {
            // test by removing each number in the report, one at a time
            return report.some( (_, index) => {
                const modifiedReport = report.slice();
                modifiedReport.splice( index, 1 );
                return reportIsSafe( modifiedReport );
            });
        }
    }).length;
}

function reportIsSafe( report: number[] ) {
    // calculate diffs between each number in the report
    const diffs = range( 1, report.length ).map( index => report[index] - report[index-1] );
    // are the numbers all increasing or all decreasing, and within certain absolute values?
    return (
        (
            diffs.every( diff => diff > 0 ) ||
            diffs.every( diff => diff < 0 )
        ) && (
            diffs.every( diff => Math.abs(diff) >= 1 && Math.abs(diff) <= 3 )
        )
    );
}


outputAnswers({
    part1: {
        solver: ( input: string ) => solve( input ),
        exptectedExampleSolution: 2,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => solve2( input ),
        exptectedExampleSolution: 4,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    }
});
