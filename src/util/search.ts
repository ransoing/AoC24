
/**
 * A flexible binary search function which, given a sorted array, returns the index at which something should be inserted. The strength of
 * this binary search is that it can make comparisons and find an index based on *derived values* from the original array, without having
 * to derive all the values of the array first (assuming that the derived values have the same sort order as the original values).
 *
 * It can also be used for a normal binary search, without deriving values.
 *
 * @param compareFunc Takes an element of the array and its index. Return < 0 if you want to keep searching lower, > 0 if you want to keep
 * searching higher, and 0 if you've found the correct element.
 *
 * @example
 * To search through a number array, you can use:
 * ```
 * insertIndexBinary( arr, n => 123456 - n );
 * ```
 *
 * @example
 * To search through an array of strings, you can use:
 * ```
 * insertIndexBinary( arr, n => 'foo'.localeCompare(n) )
 * ```
 */
export function findInsertIndexBinary<T>( array: T[], compareFunc: ( e: T, i: number ) => number ): number {
    let min = 0;
    let max = array.length - 1;
    let mid = Math.floor( (min + max) / 2 );
    
    // initially check to see if the comparisons will put the index out of bounds of the array
    if ( compareFunc(array[min], min) < 0 ) {
        return 0;
    }
    if ( compareFunc(array[max], max ) > 0) {
        return array.length;
    }
    
    while ( min < max ) {
        const comparison = compareFunc( array[mid], mid );
        if ( comparison === 0 ) {
            return mid;
        }
        if ( comparison < 0 ) {
            max = mid;
        } else {
            min = mid + 1;
        }
        mid = Math.floor( (min + max) / 2 );
    }
    return min;
}
