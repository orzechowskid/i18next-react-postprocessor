import React from 'react';

import {
    buildRegexFromOptions,
    getKeyForElement
} from './utils.js';

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

    process(value, key, options, translator) {
        const tokens = value.split(this.searchRegex);

        if (tokens.length === 1) {
            /* nothing to interpolate */
            return tokens[0];
        }

        return tokens
            .filter(Boolean) // don't care about empty strings
            .map((token, tokenIndex) => {
                if (!this.searchRegex.test(token)) {
                    return token;
                }

                /* strip prefix/suffix from token to get the interpolated variable name */
                const tokenName = token.replace(this.replaceRegex, `$1`);
                const element = options[tokenName];

                if (!element) {
                    return this.keepUnknownVariables
                        ? token
                        : ``
                };

                /* if it's not a React element, don't process it as one */
                if (!element.$$typeof) {
                    return element;
                }

                /* clone element and add a `key` prop so React won't complain */
                return (
                    <element.type
                        {...element.props}
                        key={getKeyForElement(element, tokenIndex)}
                    >
                        {element.props.children}
                    </element.type>
                );
            });
    }
}

export default ReactElementPostprocessor;
