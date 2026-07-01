import { Bench } from 'tinybench';

import * as Bourne from '../src/index.js';

const internals = {
    text: '{ "a": 5, "b": 6, "__proto__": { "x": 7 }, "c": { "d": 0, "e": "text", "__proto__": { "y": 8 }, "f": { "g": 2 } } }',
    invalid:
        '{ "a": 5, "b": 6, "__proto__": { "x": 7 }, "c": { "d": 0, "e": "text", "__proto__": { "y": 8 }, "f": { "g": 2 } } } }',
};

internals.reviver = function (key, value) {
    if (key === '__proto__') {
        throw new Error('kaboom');
    }

    return value;
};

const bench = new Bench();

bench
    .add('JSON.parse', () => {
        JSON.parse(internals.text);
    })
    .add('JSON.parse error', () => {
        try {
            JSON.parse(internals.invalid);
        } catch {}
    })
    .add('Bourne.parse', () => {
        try {
            Bourne.parse(internals.text);
        } catch {}
    })
    .add('reviver', () => {
        try {
            JSON.parse(internals.text, internals.reviver);
        } catch {}
    });

await bench.run();

console.table(bench.table());
