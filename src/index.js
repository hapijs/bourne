const suspectRx =
    /"(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])"\s*:/;

export function parse(text, ...args) {
    // Normalize arguments

    const firstOptions = typeof args[0] === 'object' && args[0];
    const reviver = args.length > 1 || !firstOptions ? args[0] : undefined;
    const options = (args.length > 1 && args[1]) || firstOptions || {};

    // Strip a leading UTF-8 BOM
    if (typeof text === 'string' && text.charCodeAt(0) === 0xfeff) {
        text = text.slice(1);
    }

    // Parse normally, allowing exceptions

    const obj = JSON.parse(text, reviver);

    // options.protoAction: 'error' (default) / 'remove' / 'ignore'

    if (options.protoAction === 'ignore') {
        return obj;
    }

    // Ignore null and non-objects

    if (!obj || typeof obj !== 'object') {
        return obj;
    }

    // Check original string for potential exploit

    if (!suspectRx.test(text)) {
        return obj;
    }

    // Scan result for proto keys

    scan(obj, options);

    return obj;
}

export function scan(obj, options = {}) {
    let next = [obj];

    while (next.length) {
        const nodes = next;
        next = [];

        for (const node of nodes) {
            if (Object.hasOwn(node, '__proto__')) {
                if (options.protoAction !== 'remove') {
                    throw new SyntaxError('Object contains forbidden prototype property');
                }

                delete node.__proto__;
            }

            for (const key in node) {
                const value = node[key];
                if (value && typeof value === 'object') {
                    next.push(node[key]);
                }
            }
        }
    }
}

export function safeParse(text, reviver) {
    try {
        return parse(text, reviver);
    } catch {
        return null;
    }
}
