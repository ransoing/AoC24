import { sum } from 'lodash';
import { isPointInPolygon } from 'geolib';
import { outputAnswers } from '../output-answers';
import { parseAsXyGrid } from '../util/grid';
import { product } from '../util/math';
import { countDiffs } from '../util/misc';
import { parseIntegers } from '../util/parse';
import { Range } from '../util/range';
import { Range2D } from '../util/range2d';
import { Range3D } from '../util/range3d';
import { findInsertIndexBinary } from '../util/search';
import { XYZ } from '../util/xyz';
const areaOfPolygon = require( 'area-polygon' );

function solve( input: string ) {
    // const blocks = input.split( '\n\n' ).map( block => block.split('\n') );
    // const steps = input.split( '\n' ).map( line => line.split(',') );
    // const lines = input.split( '\n' );
    // const grid = parseAsXyGrid( input );
}

outputAnswers({
    part1: {
        solver: ( input: string ) => solve( input ),
        exptectedExampleSolution: null, // define this
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => null, // define this
        exptectedExampleSolution: null, // define this. Use NO_EXPECTED_EXAMPLE_SOLUTION if there is no example solution provided
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    }
});
