import { expectTypeOf } from 'vitest';

import * as Bourne from '../lib/index.js';

// parse — call signatures compile

expectTypeOf(Bourne.parse).toBeFunction();
expectTypeOf(Bourne.parse('{}')).toBeAny();
expectTypeOf(Bourne.parse('{}', () => {})).toBeAny();
expectTypeOf(Bourne.parse('{}', (key, value) => ({ key, value }))).toBeAny();
expectTypeOf(Bourne.parse('{}', {})).toBeAny();
expectTypeOf(Bourne.parse('{}', { protoAction: 'error' })).toBeAny();
expectTypeOf(Bourne.parse('{}', () => {}, { protoAction: 'error' })).toBeAny();

// parse — invalid calls rejected

// @ts-expect-error first arg must be string
Bourne.parse({});
// @ts-expect-error reviver must be function or options object
Bourne.parse('{}', '');
// @ts-expect-error invalid option key
Bourne.parse('{}', { protAct: 'error' });

// scan — returns void, accepts options

expectTypeOf(Bourne.scan).toBeFunction();
expectTypeOf(Bourne.scan({})).toBeVoid();
expectTypeOf(Bourne.scan({}, {})).toBeVoid();
expectTypeOf(Bourne.scan({}, { protoAction: 'remove' })).toBeVoid();

// safeParse — call signatures compile, invalid calls rejected

expectTypeOf(Bourne.safeParse).toBeFunction();

// @ts-expect-error first arg must be string
Bourne.safeParse({});
// @ts-expect-error reviver must be function
Bourne.safeParse('{}', '');
