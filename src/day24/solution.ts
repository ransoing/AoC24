import { memoize, range } from 'lodash';
import { NO_EXPECTED_EXAMPLE_SOLUTION, outputAnswers } from '../output-answers';

function solve( input: string ) {
    const { calcZs } = parse( input );
    return parseInt( calcZs().reverse().join( '' ), 2 );
}

/*
Each Z wire output is determined by this pattern (the example below is for z03):

x02 AND y02 -> aa3
y03 XOR x03 -> bb3
    aa3 OR dd2 -> cc3  // dd2 is calculated from `cc2 AND bb2 -> dd2`
        cc3 XOR bb3 -> z03

cc3 AND bb3 -> dd3


When running the code, the output can reveal which z-wires are incorrect. For those incorrect wires, you will need to manually inspect
the input, examining the wires and gates that are supposed to feed into that incorrect z-wire. Since you know what the pattern *should*
look like, you can then determine which wire assignments are incorrect.
*/
function solve2( input: string ) {
    const { calcZs, startValues } = parse( input );

    // turns a numeric index into a 2-digit string, like 5 => '05', or 34 => '34'
    const makeIndex = ( i: number ) => i.toString().padStart( 2, '0' );

    // xs and ys should be length of 45
    const setStartValues = ( xs: number[], ys: number[] ) => {
        range( 0, 45 ).forEach( i => {
            startValues.set( `x${makeIndex(i)}`, xs[i] );
            startValues.set( `y${makeIndex(i)}`, ys[i] );
        });
    };

    // make a string that is all the same digit
    const fill = ( n: number ) => new Array( 45 ).fill( n );
    const outputBinaryString = ( zs: number[] ) => zs.slice().reverse().join( '' );

    // start by adding all 0's with all 0's
    setStartValues( fill(0), fill(0) );
    let result = calcZs();
    console.log( '\ntest:\t\t' + outputBinaryString(result) );
    console.log( 'should be:\t0000000000000000000000000000000000000000000000' );
    // add all 0's with all 1's
    setStartValues( fill(0), fill(1) );
    result = calcZs();
    console.log( '\ntest:\t\t' + outputBinaryString(result) );
    console.log( 'should be:\t0111111111111111111111111111111111111111111111' );
    // add all 1's with all 0's
    setStartValues( fill(1), fill(0) );
    console.log( '\ntest:\t\t' + outputBinaryString(result) );
    console.log( 'should be:\t0111111111111111111111111111111111111111111111' );
    // add all 1's with all 1's
    setStartValues( fill(1), fill(1) );
    result = calcZs();
    console.log( '\ntest:\t\t' + outputBinaryString(result) );
    console.log( 'should be:\t1111111111111111111111111111111111111111111110' );

    // test summing alternating 0's and 1's
    let alternating = '100100100100100100100100100100100100100100100'.split( '' ).reverse().map( v => parseInt(v) );
    setStartValues( alternating, alternating );
    result = calcZs();
    console.log( '\ntest:\t\t' + outputBinaryString(result) );
    console.log( 'should be:\t1001001001001001001001001001001001001001001000' );

    alternating = '010010010010010010010010010010010010010010010'.split( '' ).reverse().map( v => parseInt(v) );
    setStartValues( alternating, alternating );
    result = calcZs();
    console.log( '\ntest:\t\t' + outputBinaryString(result) );
    console.log( 'should be:\t0100100100100100100100100100100100100100100100' );

    alternating = '001001001001001001001001001001001001001001001'.split( '' ).reverse().map( v => parseInt(v) );
    setStartValues( alternating, alternating );
    result = calcZs();
    console.log( '\ntest:\t\t' + outputBinaryString(result) );
    console.log( 'should be:\t0010010010010010010010010010010010010010010010' );
    

    console.log( '\nInspect the tests above to see which bits cause errors in the tests. Read the comments in the code to learn about the ' +
        'patterns in the adder, then manually inspect the input to find the wires that have been swapped.' );
}

function parse( input: string ) {
    const blocks = input.split( '\n\n' ).map( block => block.split('\n') );

    // record lines like `x00: 1`, keyed by wire label, i.e. x00, with values as integers
    let startValues = new Map<string, number>(
        blocks[0].map( line => {
            const split = line.split( ': ' );
            return [ split[0], parseInt(split[1]) ];
        })
    );

    // record lines like `ntg XOR fgs -> mjb`, keyed by output wire label, with values as ['ntg', 'XOR', 'fgs']
    let ops = new Map<string, string[]>(
        blocks[1].map( line => {
            const split = line.split( ' -> ' );
            return [ split[1], split[0].split(' ') ];
        })
    );

    const getValueRaw = ( label: string ) => {
        if ( startValues.has(label) ) {
            return startValues.get( label );
        }
        const op = ops.get( label );
        const [ subVal1, subVal2 ] = [ getValue(op[0]), getValue(op[2]) ];
        return op[1] === 'AND' ? subVal1 & subVal2 :
                op[1] === 'OR' ? subVal1 | subVal2 :
                Number( BigInt(subVal1) ^ BigInt(subVal2) ); // XOR
    };

    const getValue = memoize( getValueRaw );

    // work backwards to find the values of z wires
    const zLabels = Array.from( ops.keys() ).filter( v => v.startsWith('z') ).sort();
    // returns an array of resulting z-values, with z00 first
    const calcZs = () => {
        getValue.cache.clear();
        return zLabels.map( v => getValue(v) );
    };

    return { startValues, ops, getValue, calcZs };
}

outputAnswers({
    part1: {
        solver: ( input: string ) => solve( input ),
        exptectedExampleSolution: 2024,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => solve2( input ),
        exptectedExampleSolution: NO_EXPECTED_EXAMPLE_SOLUTION,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    }
});
