import { unzip } from 'lodash';

/** parses a text input as a grid, with elements accessible at grid[y][x] and the origin in the top-left. */
function parseAsYxGrid( input: string ) {
    return input.split( '\n' ).map( line => line.split('') );
}

/**
 * parses a text input as a grid, with elements accessible at grid[x][y], with [0][0] at the bottom-left of the string representation.
 * @param elementModifier a function that can be used to modify each element as it is parsed. Useful for converting strings to numbers.
 */
export function parseAsXyGrid( input: string, elementModifier: (element: string) => any = e => e ) {
    return unzip(
        input.split( '\n' ).map(
            line => line.split('').map( elementModifier )
        ).reverse()
    )
}

/** rotates a 2D grid clockwise, assuming that positive y is right and positive x is up. Returns a new object */
export function rotateGridClockwise<T>( grid: T[][] ) {
    return unzip( grid ).map( row => row.reverse() );
}

/** rotates a 2D grid counterclockwise, assuming that positive y is right and positive x is up. Returns a new object */
export function rotateGridCounterclockwise<T>( grid: T[][] ) {
    return unzip( grid ).reverse();
}

/** mirrors the x-values of a grid (flips it across a line at y=n). Returns a new object. */
export function mirrorGridX<T>( grid: T[][] ) {
    return grid.slice().reverse();
}

/** mirrors the y-values of a grid (flips it across a line at x=n). Returns a new object. */
export function mirrorGridY<T>( grid: T[][] ) {
    return grid.map( row => row.slice().reverse() );
}

/**
 * for a 2D grid, flips the order of indexes so the element at grid[x][y] is now accessible via grid[y][x].
 * Useful for iterating over columns if working with a YxGrid
 */
export function flipRowsCols<T>( grid: T[][] ) {
    return unzip( grid );
}

/** prints the grid to console */
export function displayGrid<T>( grid: T[][] ) {
    grid.forEach( row => {
        console.log( row.join('') );
    });
}

/** runs a callback function for each element in a 2D grid */
export function forEachInGrid<T>( grid: T[][], callback: (element: T, x: number, y: number) => void ) {
    grid.forEach( (col, x) => {
        col.forEach( (element, y) => {
            callback( element, x, y );
        });
    });
}

/** replaces each item in a 2D grid with the return value of `callback`. Returns the modified grid. */
export function replaceEachInGrid<T>( grid: T[][], callback: (element: any, x?: number, y?: number) => any ) {
    grid.forEach( (col, x) => {
        col.forEach( (element, y) => {
            grid[x][y] = callback( element, x, y );
        });
    });
    return grid;
}

type MultidimensionalArray<T> = (T | MultidimensionalArray<T>)[];

/**
 * Returns the indexes of the first occurrence of `needle` in a multidimensional array. If the needle is not found, returns [ -1 ].
 * Otherwise, returns an array as long as the number of dimensions in the array. I.e. if the needle exists at `haystack[7][5][3]`,
 * this will return `[ 7, 5, 3 ]
 */
export function indexesOf<T>( needle: T, haystack: MultidimensionalArray<T> ): number[] {
    if ( Array.isArray(haystack[0] as any) ) {
        // dive deeper into each sub-array
        for ( let i = 0; i < haystack.length; i++ ) {
            const indexes = indexesOf( needle, haystack[i] as MultidimensionalArray<T> );
            if ( indexes[0] !== -1 ) {
                return [ i, ...indexes ];
            }
        }
        // not found in this sub-array
        return [ -1 ];
    } else {
        // if this is the last dimension, search directly
        return [ haystack.indexOf(needle) ];
    }
}

/**
 * Returns multidimensional indexes of every occurrence of `needle` in a multidimensional array. For example, if the needle exists
 * at `haystack[7][5][3]` and `haystack[2][4][8]`, this will return `[ [7, 5, 3], [2, 4, 8] ]`.
 * Returns `[]` if no occurrence is found.
 */
export function indexesOfEvery<T>(
    needle: T,
    haystack: MultidimensionalArray<T>,
    /** for internal use only */
    currentPosition: number[] = [],
    /** for internal use only */
    foundIndexes: number[][] = []
): number[][] {
    if ( Array.isArray(haystack[0] as any) ) {
        // dive deeper into each sub-array
        for ( let i = 0; i < haystack.length; i++ ) {
            indexesOfEvery( needle, haystack[i] as MultidimensionalArray<T>, [ ...currentPosition, i ], foundIndexes );
        }
    } else {
        // if this is the last dimension, search directly
        haystack.forEach( (element, i) => {
            if ( element === needle ) {
                foundIndexes.push( [ ...currentPosition, i ] );
            }
        });
    }
    return foundIndexes;
}
