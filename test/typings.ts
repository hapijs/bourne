import { describe, expectTypeOf, it } from 'vitest';

import * as Bourne from '../src/index.mjs';

describe('typings', () => {
    describe('parse', () => {
        it('parse — call signatures compile', () => {
            expectTypeOf(Bourne.parse).toBeFunction();
            expectTypeOf(Bourne.parse('{}')).toBeAny();
            expectTypeOf(Bourne.parse('{}', () => {})).toBeAny();
            expectTypeOf(Bourne.parse('{}', (key, value) => ({ key, value }))).toBeAny();
            expectTypeOf(Bourne.parse('{}', {})).toBeAny();
            expectTypeOf(Bourne.parse('{}', { protoAction: 'error' })).toBeAny();
            expectTypeOf(Bourne.parse('{}', () => {}, { protoAction: 'error' })).toBeAny();
        });

        it('parse — invalid calls rejected', () => {
            try {
                // @ts-expect-error first arg must be string
                Bourne.parse({});
            } catch {}
            // @ts-expect-error reviver must be function or options object
            Bourne.parse('{}', '');
            // @ts-expect-error invalid option key
            Bourne.parse('{}', { protAct: 'error' });
        });
    });

    describe('scan', () => {
        it('returns void, accepts options', () => {
            expectTypeOf(Bourne.scan).toBeFunction();
            expectTypeOf(Bourne.scan({})).toBeVoid();
            expectTypeOf(Bourne.scan({}, {})).toBeVoid();
            expectTypeOf(Bourne.scan({}, { protoAction: 'remove' })).toBeVoid();
        });
    });

    describe('safeParse', () => {
        it('call signatures compile, invalid calls rejected', () => {
            expectTypeOf(Bourne.safeParse).toBeFunction();
            // @ts-expect-error first arg must be string
            Bourne.safeParse({});
            // @ts-expect-error reviver must be function
            Bourne.safeParse('{}', '');
        });
    });
});
