import { range } from 'lodash';
import { outputAnswers } from '../output-answers';
import { parseIntegers } from '../util/parse';

function solve( input: string ) {
    const lines = input.split( '\n' );
    let aValue = parseIntegers( lines[0] )[0];
    const program = parseIntegers( lines[4] );

    let output = [];

    while ( aValue !== 0 ) {
        const { output: newOutput, newAValue } = runOneLoop( program, aValue );
        output.push( newOutput );
        aValue = newAValue;
    }

    return output.join( ',' );
}

/**
 * this assumes that the jnz opcode only occurs once in the program, and is the last opcode, and that the A register only decreases,
 * based on a constant value. I.e. The value of A never changes dependent on registers B or C.
 * This also assumes that the program runs the `out` opcode once per loop, and that the values of registers B and C on each loop
 * are dependent only on the value of register A of previous loops - i.e. at the beginning of each loop, the previous values of
 * B and C can be ignored.
 */
function runOneLoop( program: number[], aValue: number ): { output: number, newAValue: number} {
    let index = 0;
    const registers = [ aValue, 0, 0 ];
    let output: number;
    while ( true ) {
        const [ opcode, operand ] = program.slice( index, index + 2 );
        if ( opcode === 0 ) { // adv (division)
            registers[0] = getDivValue( operand );
        } else if ( opcode === 1 ) { // bxl (bitwise XOR)
            registers[1] = safeXOR( registers[1], operand );
        } else if ( opcode === 2 ) { // bst
            registers[1] = getComboOperandValue(operand) % 8;
        } else if ( opcode === 3 ) { // jnz (loop)
            break;
        } else if ( opcode === 4 ) { // bxc (bitwise XOR)
            registers[1] = safeXOR( registers[1], registers[2] );
        } else if ( opcode === 5 ) { // out (output)
            output = getComboOperandValue( operand ) % 8;
        } else if ( opcode === 6 ) { // bdv (division)
            registers[1] = getDivValue( operand );
        } else if ( opcode === 7 ) { // cdv (division)
            registers[2] = getDivValue( operand );
        }
        index += 2;
    }

    function getDivValue( operand: number ) {
        return Math.floor( registers[0] / Math.pow(2, getComboOperandValue(operand) ) );
    }

    function getComboOperandValue( operand: number ) {
        return [ 0, 1, 2, 3, registers[0], registers[1], registers[2] ][operand];
    }

    return { output, newAValue: registers[0] };
}

// javascript converts integers to 32-bit numbers before XORing, which is a problem for large numbers encountered in this puzzle
function safeXOR( num1: number, num2: number ) {
    return parseInt( (BigInt(num1) ^ BigInt(num2)).toString() );
}

/** This assumes that the A register gets divided by 8 (and floored) once per loop, and that is the only time A changes */
function solveBackwards( aValue: number, outputIndex: number, program: number[] ) {

    if ( outputIndex < 0 ) {
        return aValue;
    }
    
    // find a value of A that will result in the expected output at the given index
    const newAValues = range( aValue === 0 ? 1 : 0, 8 ).map( v => aValue * 8 + v );
    for ( let i = 0; i < newAValues.length; i++ ) {
        const { output } = runOneLoop( program, newAValues[i] );
        if ( output === program[outputIndex] ) {
            const solution = solveBackwards( newAValues[i], outputIndex - 1, program );
            if ( solution !== -1 ) {
                return solution;
            }
        }
    }
    return -1;
}

outputAnswers({
    part1: {
        solver: ( input: string ) => solve( input ),
        exptectedExampleSolution: '4,6,3,5,6,3,5,2,1,0',
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => {
            const program = parseIntegers( input.split( '\n' )[4] );
            return solveBackwards( 0, program.length - 1, program );
        },
        exptectedExampleSolution: 117440,
        exampleInputPath: `${__dirname}/example-input-2`,
        fullInputPath: `${__dirname}/full-input`
    }
});

