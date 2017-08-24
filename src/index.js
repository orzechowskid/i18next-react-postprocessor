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
        return value.split(this.searchRegex)
            .filter(Boolean)
            .map((token, tokenIndex) => {
                if (!this.searchRegex.test(token)) {
                    return token;
                }

                const tokenName = token.replace(this.replaceRegex, `$1`);
                const element = options[tokenName];

                if (!element) {
                    return this.keepUnknownVariables
                        ? token
                        : ``
                };

                if (!element.$$typeof) {
                    return element;
                }

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
