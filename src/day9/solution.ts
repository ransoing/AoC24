import { range, sum } from 'lodash';
import { outputAnswers } from '../output-answers';
import { readTextFile } from '../util/parse';

function solve( input: string ) {
    // store the disk as an array of numbers, where each element represents the file ID of that block (or `null` if empty)
    const disk = input.split( '' ).flatMap( (char, i) => {
        return new Array( parseInt(char) ).fill( i % 2 === 0 ? i / 2 : null );
    });

    const [ filledIndexes, emptyIndexes ]: number[][] = [ [], [] ];
    disk.forEach( (fileId, index) => {
        return (fileId === null ? emptyIndexes : filledIndexes).push( index )
    });
    
    // We know that the disk will end up as one contiguous block of filled space, followed by empty space.
    // Therefore, if there are n filled blocks, then any filled block after index n will move. Instead of moving blocks,
    // just start calculating the checksum, and for the blocks that need to be moved, use indexes of empty spaces
    // (running backwards from n) to calculate the checksum.
    let emptyPointer = emptyIndexes.findIndex( i => i >= filledIndexes.length );
    return sum( filledIndexes.map(
        filledIndex => disk[filledIndex] * (
            filledIndex < filledIndexes.length ? filledIndex : emptyIndexes[--emptyPointer]
        )
    ));
}

function solve2( input ) {
    const blockRuns: { fileId: number; length: number }[] = input.split( '' ).map( (char, i) => {
        return {
            fileId: i % 2 === 0 ? i / 2 : null,
            length: parseInt( char )
        };
    });
    // start computing the checksum right away, starting with the last block run, and moving it if needed. We have to actually move blocks
    // for part 2 because blocks *may or may not move*, so the calculations for a single block run cannot determine where it will end up.
    return sum(
        blockRuns.filter( run => run.fileId != null ).reverse().map( filledBlockRun => {
            // find the index of the first empty block run that can fit the filled block run
            const emptyIndex = blockRuns.findIndex( run => run.fileId === null && run.length >= filledBlockRun.length );
            if ( emptyIndex !== -1 && emptyIndex < blockRuns.indexOf(filledBlockRun) ) {
                // move the filled block and alter the remaining space of the empty block and remove the empty block if it now has length 0
                blockRuns[emptyIndex].length -= filledBlockRun.length;
                blockRuns.splice( emptyIndex, blockRuns[emptyIndex].length === 0 ? 1 : 0, filledBlockRun );
            }
            const blockIndexAtRun = sum(
                blockRuns.slice( 0, blockRuns.indexOf(filledBlockRun) ).map( run => run.length )
            );
            return sum(
                range( 0, filledBlockRun.length ).map( i => (blockIndexAtRun + i) * filledBlockRun.fileId )
            );
        })
    );
}

outputAnswers(
    // function that solves part 1
    ( input: string ) => solve( input ),
    // function that solves part 2
    ( input: string ) => solve2( input ),

    // inputs for part 1
    readTextFile( `${__dirname}/example-input` ),
    readTextFile( `${__dirname}/full-input` ),
    // inputs for part 2
    readTextFile( `${__dirname}/example-input` ),
    readTextFile( `${__dirname}/full-input` )
);
