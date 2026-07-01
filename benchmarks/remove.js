import { Bench } from 'tinybench';

import * as Bourne from '../src/index.js';

const internals = {
    text: '{ "a": 5, "b": 6, "__proto__": { "x": 7 }, "c": { "d": 0, "e": "text", "__proto__": { "y": 8 }, "f": { "g": 2 } } }',
};

internals.reviver = function (key, value) {
    if (key === '__proto__') {
        return undefined;
    }

    return value;
};

const bench = new Bench();

bench
    .add('JSON.parse', () => {
        JSON.parse(internals.text);
    })
    .add('Bourne.parse', () => {
        Bourne.parse(internals.text, { protoAction: 'remove' });
    })
    .add('reviver', () => {
        JSON.parse(internals.text, internals.reviver);
    });

await bench.run();

console.table(bench.table());
