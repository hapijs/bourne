import * as Bourne from '..';
import * as Lab from '@hapi/lab';

const { expect } = Lab.types;

// parse

expect.type<unknown>(Bourne.parse('{}'));
expect.type<unknown>(Bourne.parse('{}', () => {}));
expect.type<unknown>(Bourne.parse('{}', (key, value) => ({ key, value })));
expect.type<unknown>(Bourne.parse('{}', {}));
expect.type<unknown>(Bourne.parse('{}', { protoAction: 'error' }));
expect.type<unknown>(Bourne.parse('{}', () => {}, { protoAction: 'error' }));

expect.error(Bourne.parse({}));
expect.error(Bourne.parse('{}', ''));
expect.error(Bourne.parse('{}', { protAct: 'error' }));

// scan

expect.type<void>(Bourne.scan({}));
expect.type<void>(Bourne.scan({}, {}));
expect.type<void>(Bourne.scan({}, { protoAction: 'remove' }));

// safeParse

expect.type<unknown | null>(Bourne.safeParse('{}'));
expect.type<unknown | null>(Bourne.safeParse('{}', () => {}));

expect.error(Bourne.safeParse({}));
expect.error(Bourne.safeParse('{}', ''));
