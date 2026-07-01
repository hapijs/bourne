import { describe, it, expect } from 'vitest';

import * as Bourne from '../src/index.js';

describe('Bourne', () => {
    describe('parse()', () => {
        it('parses object string', () => {
            expect(Bourne.parse('{"a": 5, "b": 6}')).toEqual({ a: 5, b: 6 });
        });

        it('parses null string', () => {
            expect(Bourne.parse('null')).toBeNull();
        });

        it('parses zero string', () => {
            expect(Bourne.parse('0')).toBe(0);
        });

        it('parses string string', () => {
            expect(Bourne.parse('"x"')).toBe('x');
        });

        it('parses object string (reviver)', () => {
            const reviver = (key, value) => {
                return typeof value === 'number' ? value + 1 : value;
            };

            expect(Bourne.parse('{"a": 5, "b": 6}', reviver)).toEqual({ a: 6, b: 7 });
        });

        it('sanitizes object string (reviver, options)', () => {
            const reviver = (key, value) => {
                return typeof value === 'number' ? value + 1 : value;
            };

            expect(
                Bourne.parse('{ "a": 5, "b": 6, "__proto__": { "x": 7 } }', reviver, {
                    protoAction: 'remove',
                }),
            ).toEqual({ a: 6, b: 7 });
        });

        it('sanitizes object string (options)', () => {
            expect(Bourne.parse('{ "a": 5, "b": 6, "__proto__": { "x": 7 } }', { protoAction: 'remove' })).toEqual({
                a: 5,
                b: 6,
            });
        });

        it('sanitizes object string (null, options)', () => {
            expect(
                Bourne.parse('{ "a": 5, "b": 6, "__proto__": { "x": 7 } }', null, {
                    protoAction: 'remove',
                }),
            ).toEqual({ a: 5, b: 6 });
        });

        it('sanitizes nested object string', () => {
            const text =
                '{ "a": 5, "b": 6, "__proto__": { "x": 7 }, "c": { "d": 0, "e": "text", "__proto__": { "y": 8 }, "f": { "g": 2 } } }';
            expect(Bourne.parse(text, { protoAction: 'remove' })).toEqual({
                a: 5,
                b: 6,
                c: { d: 0, e: 'text', f: { g: 2 } },
            });
        });

        it('ignores proto property', () => {
            const text = '{ "a": 5, "b": 6, "__proto__": { "x": 7 } }';
            expect(Bourne.parse(text, { protoAction: 'ignore' })).toEqual(JSON.parse(text));
        });

        it('ignores proto value', () => {
            expect(Bourne.parse('{"a": 5, "b": "__proto__"}')).toEqual({ a: 5, b: '__proto__' });
        });

        it('errors on proto property', () => {
            expect(() => Bourne.parse('{ "a": 5, "b": 6, "__proto__": { "x": 7 } }')).toThrow(SyntaxError);
            expect(() => Bourne.parse('{ "a": 5, "b": 6, "__proto__" : { "x": 7 } }')).toThrow(SyntaxError);
            expect(() => Bourne.parse('{ "a": 5, "b": 6, "__proto__" \n\r\t : { "x": 7 } }')).toThrow(SyntaxError);
            expect(() => Bourne.parse('{ "a": 5, "b": 6, "__proto__" \n \r \t : { "x": 7 } }')).toThrow(SyntaxError);
        });

        it('errors on proto property (null, null)', () => {
            expect(() => Bourne.parse('{ "a": 5, "b": 6, "__proto__": { "x": 7 } }', null, null)).toThrow(SyntaxError);
        });

        it('errors on proto property (explicit options)', () => {
            expect(() => Bourne.parse('{ "a": 5, "b": 6, "__proto__": { "x": 7 } }', { protoAction: 'error' })).toThrow(
                SyntaxError,
            );
        });

        it('ignores leading BOM', () => {
            expect(Bourne.parse('\uFEFF{"a": 5, "b": 6}')).toEqual({ a: 5, b: 6 });
        });

        it('errors on proto property (unicode)', () => {
            expect(() => Bourne.parse('{ "a": 5, "b": 6, "\\u005f_proto__": { "x": 7 } }')).toThrow(SyntaxError);
            expect(() => Bourne.parse('{ "a": 5, "b": 6, "_\\u005fp\\u0072oto__": { "x": 7 } }')).toThrow(SyntaxError);
            expect(() =>
                Bourne.parse(
                    '{ "a": 5, "b": 6, "\\u005f\\u005f\\u0070\\u0072\\u006f\\u0074\\u006f\\u005f\\u005f": { "x": 7 } }',
                ),
            ).toThrow(SyntaxError);
            expect(() => Bourne.parse('{ "a": 5, "b": 6, "\\u005F_proto__": { "x": 7 } }')).toThrow(SyntaxError);
            expect(() => Bourne.parse('{ "a": 5, "b": 6, "_\\u005Fp\\u0072oto__": { "x": 7 } }')).toThrow(SyntaxError);
            expect(() =>
                Bourne.parse(
                    '{ "a": 5, "b": 6, "\\u005F\\u005F\\u0070\\u0072\\u006F\\u0074\\u006F\\u005F\\u005F": { "x": 7 } }',
                ),
            ).toThrow(SyntaxError);
        });
    });

    describe('scan()', () => {
        it('sanitizes nested object string', () => {
            const text =
                '{ "a": 5, "b": 6, "__proto__": { "x": 7 }, "c": { "d": 0, "e": "text", "__proto__": { "y": 8 }, "f": { "g": 2 } } }';
            const obj = JSON.parse(text);

            Bourne.scan(obj, { protoAction: 'remove' });
            expect(obj).toEqual({ a: 5, b: 6, c: { d: 0, e: 'text', f: { g: 2 } } });
        });

        it('errors on proto property', () => {
            const text =
                '{ "a": 5, "b": 6, "__proto__": { "x": 7 }, "c": { "d": 0, "e": "text", "__proto__": { "y": 8 }, "f": { "g": 2 } } }';
            const obj = JSON.parse(text);

            expect(() => Bourne.scan(obj)).toThrow(SyntaxError);
        });

        it('does not break when hasOwnProperty is overwritten', () => {
            const text = '{ "a": 5, "b": 6, "hasOwnProperty": "text", "__proto__": { "x": 7 } }';
            const obj = JSON.parse(text);

            Bourne.scan(obj, { protoAction: 'remove' });
            expect(obj).toEqual({ a: 5, b: 6, hasOwnProperty: 'text' });
        });
    });

    describe('safeParse()', () => {
        it('parses object string', () => {
            expect(Bourne.safeParse('{"a": 5, "b": 6}')).toEqual({ a: 5, b: 6 });
        });

        it('returns null on proto object string', () => {
            expect(Bourne.safeParse('{ "a": 5, "b": 6, "__proto__": { "x": 7 } }')).toBeNull();
        });

        it('returns null on invalid object string', () => {
            expect(Bourne.safeParse('{"a": 5, "b": 6')).toBeNull();
        });
    });
});
