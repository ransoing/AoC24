import { sum } from 'lodash';
import { outputAnswers } from '../output-answers';
import { indexesOf, indexesOfEvery, parseAsXyGrid } from '../util/grid';
import { XYZ } from '../util/xyz';

/*
The general strategy for part 2 is to keep track of the doubly-wide boxes by the location of their left half.
I don't draw the boxes on the map - the map has only '.' and '#', and we keep track of an array of boxes, always keeping
in mind that the boxes are two spaces wide.
When moving boxes in part 2, I use recursion to check of the box can move, then I move the box (and recursively move any additional
boxes that are in the way of *that* box).
This solution is slow - drawing the boxes on the map could be faster, or keeping track of an index of boxes by their location(s).
*/

function solve( input: string, part2 = false ) {
    const blocks = input.split( '\n\n' );
    const grid = parseAsXyGrid( blocks[0] );
    const instructions = blocks[1].split( '\n' );
    const bot = new XYZ( indexesOf( '@', grid ) );
    bot.setValueIn( grid, '.' );
    const boxes: XYZ[] = indexesOfEvery( 'O', grid ).map( coords => new XYZ(coords) );
    boxes.forEach( box => box.setValueIn(grid, '.') );

    const stepFn = part2 ? part2Step : part1Step;
    if ( part2 ) {
        // make the grid twice as wide
        for( let i = 0; i < grid.length; i++ ) {
            grid.splice( i, 0, grid[i].slice() );
            i++;
        }
        // correct the positions of the boxes and the bot
        bot.x *= 2;
        boxes.forEach( box => box.x *= 2 );
    }


    function part1Step( dirString: string ) {
        const dir: XYZ = arrowToDir( dirString );
        if ( bot.plus(dir).valueIn(grid) === '#' ) {
            // hit a wall. do nothing.
            return;
        } else if ( !boxes.some(box => box.equals( bot.plus(dir) )) ) {
            // move the bot
            bot.add( dir );
        } else {
            // hit a box. push boxes
            const boxesInLine: XYZ[] = [];
            let nextSpot = bot.copy();
            while ( true ) {
                nextSpot.add( dir );
                if ( nextSpot.valueIn(grid) === '#' ) {
                    // not able to push boxes
                    return;
                }
                const boxAtSpot = boxes.find( box => box.equals(nextSpot) );
                if ( boxAtSpot == null ) {
                    // move the bot and boxes
                    bot.add( dir );
                    boxesInLine.forEach( box => box.add(dir) );
                    return;
                } else {
                    boxesInLine.push( boxAtSpot );
                }
            }
        }
    }

    function part2Step( dirString: string ) {
        const dir: XYZ = arrowToDir( dirString );
        if ( bot.plus(dir).valueIn(grid) === '#' ) {
            // hit a wall. do nothing.
            return;
        }
        const boxInTheWay = boxes.find( box => {
            return box.equals( bot.plus(dir) ) ||
                box.plus([ 1, 0 ]).equals( bot.plus(dir) )
        });
        if ( boxInTheWay == null || moveWideBox(boxInTheWay, dir) ) {
            // move the bot
            bot.add( dir );
        }
    }

    function arrowToDir( arrow: string ) {
        return arrow === '<' ? new XYZ([ -1, 0 ]) :
            arrow === '>' ? new XYZ([ 1, 0 ]) :
            arrow === '^' ? new XYZ([ 0, 1 ]) :
            arrow === 'v' ? new XYZ([ 0, -1 ]) : null;
    }

    // attempts to move a box in the specified direction. returns whether the box moved.
    function moveWideBox( box: XYZ, dir: XYZ ): boolean {
        // if this box can move, move the box(es) in the way first, then move this box
        if ( dir.y === 0 && canMoveWideBoxX(box, dir) ) {
            getCollidingBoxX( box, dir ).forEach( b => moveWideBox(b, dir) );
            box.add( dir );
            return true;
        } else if ( dir.x === 0 && canMoveWideBoxY(box, dir) ) {
            getCollidingBoxesY( box, dir ).forEach( b => moveWideBox(b, dir) );
            box.add( dir );
            return true;
        }
        return false;
    }

    function canMoveWideBoxX( box: XYZ, dir: XYZ ) {
        // check for a wall
        if ( box.plus([ dir.x === 1 ? 2 : -1, 0 ]).valueIn(grid) === '#' ) {
            return false;
        }
        return getCollidingBoxX( box, dir ).every( b => canMoveWideBoxX(b, dir) );
    }

    function canMoveWideBoxY( box: XYZ, dir: XYZ ) {
        // check for walls in two spots, because the box is two spaces wide
        if (
            box.plus( dir ).valueIn( grid ) === '#' ||
            box.plus( dir ).plus([ 1, 0 ]).valueIn( grid ) === '#'
        ) {
            return false;
        }
        return getCollidingBoxesY( box, dir ).every( b => canMoveWideBoxY(b, dir) );
    }

    // returns an array, of 1 element at most
    function getCollidingBoxX( box: XYZ, dir: XYZ ) {
        return boxes.filter( otherBox => otherBox.equals( box.plus([ dir.x === 1 ? 2 : -2, 0 ]) ) );
    }
    
    function getCollidingBoxesY( box: XYZ, dir: XYZ ) {
        // check for boxes in three spots, because that's the size of overlap between two doubly-wide boxes
        return boxes.filter( otherBox => {
            return otherBox.equals( box.plus(dir) ) ||
                otherBox.equals( box.plus(dir).plus([ 1, 0 ]) ) ||
                otherBox.equals( box.plus(dir).plus([ -1, 0 ]) );
        });
    }

    instructions.forEach( instructionLine => {
        instructionLine.split( '' ).forEach( stepChar => stepFn(stepChar) );
    });

    return sum(
        boxes.map( box => 100 * (grid[0].length - box.y - 1) + box.x )
    );
}


outputAnswers({
    part1: {
        solver: ( input: string ) => solve( input ),
        exptectedExampleSolution: 10092,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => solve( input, true ),
        exptectedExampleSolution: 9021,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    }
});
