import { sum } from 'lodash';
import { outputAnswers } from '../output-answers';

function solve( input: string ) {
    const lines = input.split( '\n' );

    return sum( lines.map( line => {
        let secret = parseInt( line );
        for ( let i = 0; i < 2000; i++ ) {
            secret = evolve( secret );
        }
        return secret;
    }));
}

function solve2( input: string ) {
    const buyers = input.split( '\n' ).map( line => parseInt(line) );

    // keep track of the total number of bananas bought for each unique sequence of price changes
    const totalBananas = new Map<string, number>();

    buyers.forEach( secret => {
        // `prices` and `singleChanges` are needed for quickly calculating prices changes, and also the string representation of the
        // sequence of the last 4 price changes
        const prices = [ secret % 10 ];
        const singleChanges = [ null ];
        const sequencesSeen = new Set<string>();
        for ( let i = 0; i < 2000; i++ ) {
            const newSecret = evolve( secret );
            const newPrice = newSecret % 10;
            prices.push( newPrice );
            singleChanges.push( prices[i] - newPrice );
            if ( i >= 3 ) {
                const sequence = singleChanges.slice( -4 ).join( '' );
                if ( !sequencesSeen.has(sequence) ) {
                    // it's the first time we've seen this sequence for this buyer. Add to the total bananas bought when using this sequence
                    sequencesSeen.add( sequence );
                    totalBananas.set( sequence, (totalBananas.get(sequence) ?? 0) + newPrice );
                }
            }
            secret = newSecret;
        }
    });

    return Math.max( ...Array.from(totalBananas.values()) );
}

function evolve( secret: number ) {
    secret = prune( mix(secret * 64, secret) );
    secret = prune( mix(Math.floor( secret / 32 ), secret ) );
    secret = prune( mix(secret * 2048, secret) );
    return secret;
}

function mix( result: number, secret: number ) {
    return Number( BigInt( result ) ^ BigInt( secret ) );
}

function prune( num: number ) {
    return num % 16777216;
}

outputAnswers({
    part1: {
        solver: ( input: string ) => solve( input ),
        exptectedExampleSolution: 37327623,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => solve2( input ),
        exptectedExampleSolution: 23,
        exampleInputPath: `${__dirname}/example-input-2`,
        fullInputPath: `${__dirname}/full-input`
    }
});
