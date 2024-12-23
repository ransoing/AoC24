import { intersectionWith } from 'lodash';
import { outputAnswers } from '../output-answers';
import { findInsertIndexBinary } from '../util/search';

interface INode {
    connections: INode[];
    label: string;
}

function solve( input: string, part1 = true ) {
    const lines = input.split( '\n' );

    // build a doubly linked graph of computers, with each computer being a node
    const nodes = new Map<string, INode>();
    lines.forEach( line => {
        const labels = line.split( '-' );
        if ( !nodes.has(labels[0]) ) {
            nodes.set( labels[0], { connections: [], label: labels[0] } );
        }
        if ( !nodes.has(labels[1]) ) {
            nodes.set( labels[1], { connections: [], label: labels[1] } );
        }
        nodes.get(labels[0]).connections.push( nodes.get(labels[1]) );
        nodes.get(labels[1]).connections.push( nodes.get(labels[0]) );
    });

    
    // sort the keys, and sort the connected lists of each node by key
    const keys = Array.from( nodes.keys() ).sort( (a, b) => a.localeCompare(b) );
    keys.forEach( key => {
        nodes.get( key ).connections.sort( (a, b) => a.label.localeCompare(b.label) );
    });

    let networks: INode[][] = [];
    // start by creating a list of all networks with 2 known nodes that are connected to each other.
    // This is almost the same as the original input, but with the connections sorted alphabetically (even with "b-a" represented as "a-b")
    keys.forEach( label => {
        const node = nodes.get( label );
        const startIndex = findInsertIndexBinary( node.connections, e => label.localeCompare(e.label) );
        node.connections.slice( startIndex ).forEach( connection => networks.push([ node, connection ]) );
    });
    // for each network, and for each node that connects to every one of the nodes in the network, create a new network that is one node
    // bigger and includes the new node. Do this until we can't make networks that are any larger.
    // If running part 1, stop this once networks are of size 3
    while ( !part1 || networks[0].length < 3 ) {
        let biggerNetworks: INode[][] = [];
        networks.forEach( network => {
            // to find nodes that are connected to all of the nodes in the network, find the intersection of each node's connections.
            // To reduce duplicate calculations and avoid duplicate networks, I can take advantage of the fact that everything is
            // sorted alphabetically, and only take into acount the connections with labels that occur after the last label currently
            // in the network.
            const lastLabel = network[network.length - 1].label;
            const intersection = intersectionWith(
                ...network.map( node => node.connections.slice(
                    findInsertIndexBinary( node.connections, e => lastLabel.localeCompare(e.label) )
                )),
                (a, b) => a === b
            );
            intersection.forEach( node => biggerNetworks.push(network.concat(node)) );
        });
        if ( biggerNetworks.length === 0 ) {
            break;
        }
        networks = biggerNetworks;
    }
 
    if ( part1 ) {
        // return the number of networks that have a node that start's with 't'
        return networks.filter( network => network.some(node => node.label.startsWith('t')) ).length;
    } else {
        // based on the puzzle's text, we can now expect `networks` to have a single network. This is the biggest possible network.
        return networks[0].map( node => node.label ).join( ',' );
    }
}

outputAnswers({
    part1: {
        solver: ( input: string ) => solve( input ),
        exptectedExampleSolution: 7,
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    },
    part2: {
        solver: ( input: string ) => solve( input, false ),
        exptectedExampleSolution: 'co,de,ka,ta',
        exampleInputPath: `${__dirname}/example-input`,
        fullInputPath: `${__dirname}/full-input`
    }
});
