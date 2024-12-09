import { exit } from 'process';
import { readTextFile } from './util/parse';

interface partConfig {
    solver: (input: string) => any;
    exptectedExampleSolution: any;
    exampleInputPath: string;
    fullInputPath: string;
}

/** Outputs answers to the console */
export function outputAnswers( config: {part1: partConfig, part2?: partConfig} ) {
    [ config.part1, config.part2 ].forEach( (part, i) => {
        // if the part isn't defined, or if the expected solution is null, skip it
        if ( part ) {
            if ( part.exptectedExampleSolution == null ) {
                console.log( `Not running Part ${i + 1} - no expected example solution provided` );
                return;
            }
            // solve using the example input
            const exampleInput = readTextFile( part.exampleInputPath );
            let solved = clockSolution( () => part.solver(exampleInput) );
            console.log( `Part ${i + 1} (example input) \truntime: ${solved.displayedTime}    \tsolution:`, solved.solution );
            // bail if the example solution is incorrect
            if ( solved.solution !== part.exptectedExampleSolution ) {
                console.error('\x1b[41m%s\x1b[0m', ` Error in part ${i + 1} example - expected ${part.exptectedExampleSolution}, got ${solved.solution} ` );
                exit();
            }
            
            // solve using the full input
            const fullInput = readTextFile( part.fullInputPath );
            solved = clockSolution( () => part.solver(fullInput) );
            console.log( `Part ${i + 1} (full input) \truntime: ${solved.displayedTime}    \tsolution:`, solved.solution );
        }
    });
}

function clockSolution( solver: () => any) {
    const start = performance.now();
    const solution = solver();
    let ms = performance.now() - start;
    ms = Math.round( ms * 100 ) / 100;
    const displayedTime = ms > 999 ? ( ms / 1000 ).toString() + ' s' : ms.toString() + ' ms'
    return { displayedTime, solution };
}
