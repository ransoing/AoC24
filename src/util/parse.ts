import { readFileSync } from 'fs';

export function readTextFile( path: string ) {
    return readFileSync( path, { encoding: 'utf-8' } );
}

/** returns an array of multi-digit numbers (possibly negative ones) found in a string, parsed as integers */
export function parseIntegers( str: string ): number[] {
    return [ ...str.matchAll( /-?\d+/g ) ].map( match => parseInt(match[0]) );
}

/** returns an array of numbers potentially with decimals (possibly negative ones), found in a string, parsed as floats */
export function parseFloats( str: string ): number[] {
    return [ ...str.matchAll( /-?\d+(\.\d+)?/g ) ].map( match => parseFloat(match[0]) );
}
