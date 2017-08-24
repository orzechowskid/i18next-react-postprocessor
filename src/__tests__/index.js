import React from 'react';

import ReactElementPostprocessor from '../index.js';

describe(`the ReactElementPostprocessor class definition`, function() {
    it(`sets the proper fields upon instantiation`, function() {
        const plugin = new ReactElementPostprocessor();

        /* i18next post-processor plugins must have a name, a type (equal to "postProcessor"), and a
         * `process()` function */
        expect(plugin.name).toEqual(`reactPostprocessor`);
        expect(plugin.type).toEqual(`postProcessor`);
        expect(plugin.process).toBeInstanceOf(Function);
    });
});

describe(`the ReactElementPostprocessor process function`, function() {
    const element1 = (
        <span key="a">hello</span>
    );
    const element2 = (
        <div>also hello</div>
    );
    const i18nextOpts = {
        token1: element1,
        token2: element2
    };
    let string = `foo <token1> <token2> bar`;

    it(`replaces tokens with elements`, function() {
        const plugin = new ReactElementPostprocessor();
        const result = plugin.process(string, `__unused`, i18nextOpts);

        expect(result).toMatchSnapshot();
    });

    it(`replaces tokens with elements when using custom delimiters`, function() {
        const plugin = new ReactElementPostprocessor({
            prefix: `%`,
            suffix: `%`
        });
        const stringWithCustomDelimiters = `foo %token1% %token2% bar`;
        const result = plugin.process(stringWithCustomDelimiters, `__unused`, i18nextOpts);

        expect(result).toMatchSnapshot();
    });

    it(`replaces unknown tokens with the empty string`, function() {
        const plugin = new ReactElementPostprocessor();
        const string = `foo <__missing> bar`;

        const result = plugin.process(string, `__unused`, i18nextOpts);

        expect(result).toEqual([
            `foo `,
            ``,
            ` bar`
        ]);
    });

    it(`doesn't replace unknown tokens when keepUnknownVariables is true`, function() {
        const plugin = new ReactElementPostprocessor({
            keepUnknownVariables: true
        });
        const result = plugin.process(string, `__unused`, {});

        expect(result).toEqual([
            `foo `,
            `<token1>`,
            ` `,
            `<token2>`,
            ` bar`
        ]);
    });

    it(`doesn't try anything funny if the interpolation value is not a React element`, function() {
        const plugin = new ReactElementPostprocessor();
        const result = plugin.process(string, `__unused`, {
            token1: `t1`,
            token2: `t2`
        });

        expect(result).toEqual([
            `foo `,
            `t1`,
            ` `,
            `t2`,
            ` bar`
        ]);
    });
});
