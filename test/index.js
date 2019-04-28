'use strict';

const Code = require('code');
const Bourne = require('..');
const Lab = require('lab');


const internals = {};


const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;


describe('Bourne', () => {

    describe('parse()', () => {

        it('parses object string', (done) => {

            expect(Bourne.parse('{"a": 5, "b": 6}')).to.equal({ a: 5, b: 6 });
            done();
        });

        it('parses null string', (done) => {

            expect(Bourne.parse('null')).to.equal(null);
            done();
        });

        it('parses zero string', (done) => {

            expect(Bourne.parse('0')).to.equal(0);
            done();
        });

        it('parses string string', (done) => {

            expect(Bourne.parse('"x"')).to.equal('x');
            done();
        });

        it('parses object string (reviver)', (done) => {

            const reviver = (key, value) => {

                return typeof value === 'number' ? value + 1 : value;
            };

            expect(Bourne.parse('{"a": 5, "b": 6}', reviver)).to.equal({ a: 6, b: 7 });
            done();
        });

        it('sanitizes object string (reviver, options)', (done) => {

            const reviver = (key, value) => {

                return typeof value === 'number' ? value + 1 : value;
            };

            expect(Bourne.parse('{ "a": 5, "b": 6, "__proto__": { "x": 7 } }', reviver, { protoAction: 'remove' })).to.equal({ a: 6, b: 7 });
            done();
        });

        it('sanitizes object string (options)', (done) => {

            expect(Bourne.parse('{ "a": 5, "b": 6, "__proto__": { "x": 7 } }', { protoAction: 'remove' })).to.equal({ a: 5, b: 6 });
            done();
        });

        it('sanitizes object string (null, options)', (done) => {

            expect(Bourne.parse('{ "a": 5, "b": 6, "__proto__": { "x": 7 } }', null, { protoAction: 'remove' })).to.equal({ a: 5, b: 6 });
            done();
        });

        it('sanitizes nested object string', (done) => {

            const text = '{ "a": 5, "b": 6, "__proto__": { "x": 7 }, "c": { "d": 0, "e": "text", "__proto__": { "y": 8 }, "f": { "g": 2 } } }';
            expect(Bourne.parse(text, { protoAction: 'remove' })).to.equal({ a: 5, b: 6, c: { d: 0, e: 'text', f: { g: 2 } } });
            done();
        });

        it('ignores proto property', (done) => {

            const text = '{ "a": 5, "b": 6, "__proto__": { "x": 7 } }';
            expect(Bourne.parse(text, { protoAction: 'ignore' })).to.equal(JSON.parse(text));
            done();
        });

        it('ignores proto value', (done) => {

            expect(Bourne.parse('{"a": 5, "b": "__proto__"}')).to.equal({ a: 5, b: '__proto__' });
            done();
        });

        it('errors on proto property', (done) => {

            expect(() => Bourne.parse('{ "a": 5, "b": 6, "__proto__": { "x": 7 } }')).to.throw(SyntaxError);
            expect(() => Bourne.parse('{ "a": 5, "b": 6, "__proto__" : { "x": 7 } }')).to.throw(SyntaxError);
            expect(() => Bourne.parse('{ "a": 5, "b": 6, "__proto__" \n\r\t : { "x": 7 } }')).to.throw(SyntaxError);
            expect(() => Bourne.parse('{ "a": 5, "b": 6, "__proto__" \n \r \t : { "x": 7 } }')).to.throw(SyntaxError);
            done();
        });

        it('errors on proto property (null, null)', (done) => {

            expect(() => Bourne.parse('{ "a": 5, "b": 6, "__proto__": { "x": 7 } }', null, null)).to.throw(SyntaxError);
            done();
        });

        it('errors on proto property (explicit options)', (done) => {

            expect(() => Bourne.parse('{ "a": 5, "b": 6, "__proto__": { "x": 7 } }', { protoAction: 'error' })).to.throw(SyntaxError);
            done();
        });

        it('errors on proto property (unicode)', (done) => {

            expect(() => Bourne.parse('{ "a": 5, "b": 6, "\\u005f_proto__": { "x": 7 } }')).to.throw(SyntaxError);
            expect(() => Bourne.parse('{ "a": 5, "b": 6, "_\\u005fp\\u0072oto__": { "x": 7 } }')).to.throw(SyntaxError);
            expect(() => Bourne.parse('{ "a": 5, "b": 6, "\\u005f\\u005f\\u0070\\u0072\\u006f\\u0074\\u006f\\u005f\\u005f": { "x": 7 } }')).to.throw(SyntaxError);
            expect(() => Bourne.parse('{ "a": 5, "b": 6, "\\u005F_proto__": { "x": 7 } }')).to.throw(SyntaxError);
            expect(() => Bourne.parse('{ "a": 5, "b": 6, "_\\u005Fp\\u0072oto__": { "x": 7 } }')).to.throw(SyntaxError);
            expect(() => Bourne.parse('{ "a": 5, "b": 6, "\\u005F\\u005F\\u0070\\u0072\\u006F\\u0074\\u006F\\u005F\\u005F": { "x": 7 } }')).to.throw(SyntaxError);
            done();
        });
    });

    describe('scan()', () => {

        it('sanitizes nested object string', (done) => {

            const text = '{ "a": 5, "b": 6, "__proto__": { "x": 7 }, "c": { "d": 0, "e": "text", "__proto__": { "y": 8 }, "f": { "g": 2 } } }';
            const obj = JSON.parse(text);

            Bourne.scan(obj, { protoAction: 'remove' });
            expect(obj).to.equal({ a: 5, b: 6, c: { d: 0, e: 'text', f: { g: 2 } } });
            done();
        });

        it('errors on proto property', (done) => {

            const text = '{ "a": 5, "b": 6, "__proto__": { "x": 7 }, "c": { "d": 0, "e": "text", "__proto__": { "y": 8 }, "f": { "g": 2 } } }';
            const obj = JSON.parse(text);

            expect(() => Bourne.scan(obj)).to.throw(SyntaxError);
            done();
        });

        it('does not break when hasOwnProperty is overwritten', (done) => {

            const text = '{ "a": 5, "b": 6, "hasOwnProperty": "text", "__proto__": { "x": 7 } }';
            const obj = JSON.parse(text);

            Bourne.scan(obj, { protoAction: 'remove' });
            expect(obj).to.equal({ a: 5, b: 6, hasOwnProperty: 'text' });
            done();
        });
    });

    describe('safeParse()', () => {

        it('parses object string', (done) => {

            expect(Bourne.safeParse('{"a": 5, "b": 6}')).to.equal({ a: 5, b: 6 });
            done();
        });

        it('returns null on proto object string', (done) => {

            expect(Bourne.safeParse('{ "a": 5, "b": 6, "__proto__": { "x": 7 } }')).to.be.null();
            done();
        });

        it('returns null on invalid object string', (done) => {

            expect(Bourne.safeParse('{"a": 5, "b": 6')).to.be.null();
            done();
        });
    });
});
