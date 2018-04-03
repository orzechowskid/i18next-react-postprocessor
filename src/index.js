import React from 'react';

import {
    buildRegexFromOptions,
    getKeyForElement
} from './utils';

function clone(element) {
    if (!element.$$typeof) {
        throw new Error(`clone() requires an element`);
    }

    const {
        props,
        type: Type
    } = element;
    const key = getKeyForElement(element);

    /* clone element and add a `key` prop so React won't complain */
    return (
        <Type
            {...props}
            key={key}
        >
            {props.children}
        </Type>
    );
}

class ReactElementPostprocessor {
    constructor(opts = {}) {
        this.name = `reactPostprocessor`;
        this.type = `postProcessor`;

        this.keepUnknownVariables = opts.keepUnknownVariables;
        this.prefix = opts.prefix || `<`;
        this.suffix = opts.suffix || `>`;

        this.searchRegex = buildRegexFromOptions({
            capturePrefixAndSuffix: true,
            prefix: this.prefix,
            suffix: this.suffix
        });
        this.replaceRegex = buildRegexFromOptions({
            prefix: this.prefix,
            suffix: this.suffix
        });
    }

    process(value, key, options) {
        const tokens = value.split(this.searchRegex);

        if (tokens.length === 1) {
            /* nothing to interpolate */
            return tokens[0];
        }

        return tokens
            .filter(Boolean) // don't care about empty strings
            .map((token) => {
                if (!this.searchRegex.test(token)) {
                    return token;
                }

                /* strip prefix/suffix from token to get the interpolated variable name */
                const tokenName = token.replace(this.replaceRegex, `$1`);
                const element = options[tokenName];

                if (!element) {
                    return this.keepUnknownVariables
                        ? token
                        : ``;
                }

                if (element.$$typeof) {
                    return clone(element);
                } else if (typeof element === `function`) {
                    return clone(element());
                }
                console.info(``);

                return this.keepUnknownVariables
                    ? token
                    : ``;
            });
    }
}

export default ReactElementPostprocessor;
