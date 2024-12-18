
/**
 * A flexible binary search function which, given a sorted array, returns the index at which something should be inserted.
 * @param compareFunc Takes an element of the array and its index. Return < 0 if you want to keep searching lower, > 0 if you want to keep
 * searching higher, and 0 if you've found the correct element.
 */
export function insertIndexBinary<T>( array: T[], compareFunc: ( e: T, i: number ) => number ): number {
    let min = 0;
    let max = array.length - 1;
    let mid = Math.floor( (min + max) / 2 );
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
