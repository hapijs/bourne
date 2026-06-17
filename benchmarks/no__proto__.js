import { Bench } from 'tinybench';

import * as Bourne from '../lib/index.js';

const internals = {
    text: '{ "a": 5, "b": 6, "proto": { "x": 7 }, "c": { "d": 0, "e": "text", "\\u005f\\u005fproto": { "y": 8 }, "f": { "g": 2 } } }',
    suspectRx:
        /"(?:_|\\u005f)(?:_|\\u005f)(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006f)(?:t|\\u0074)(?:o|\\u006f)(?:_|\\u005f)(?:_|\\u005f)"/,
};

internals.reviver = function (key, value) {
    if (key.match(internals.suspectRx)) {
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
        Bourne.parse(internals.text);
    })
    .add('reviver', () => {
        JSON.parse(internals.text, internals.reviver);
    });

await bench.run();

console.table(bench.table());
