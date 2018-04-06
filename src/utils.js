import md5 from 'md5';

/**
 * @param {String} str
 * @return {String} `str` with regex-special characters escaped
 */
function regexProofString(str) {
    return str.replace(/[-\/\\^$.*+?()[\]{}]/g, `\\$&`);
}

/**
 * @param {Object} opts
 * @param {Boolean} opts.capture - whether or not to capture prefix/suffix
 * @param {String} opts.prefix - token delimiter
 * @param {String} opts.suffix - token delimiter
 * @return {RegExp} a RegExp matching tokens to replace with React elements
 */
function buildRegexFromOptions(opts) {
    const {
        capturePrefixAndSuffix = false,
        prefix,
        suffix
    } = opts;

    if (!prefix || !suffix) {
        throw new Error(`prefix and suffix must be provided in options`);
    }

    const escapedPrefix = regexProofString(prefix);
    const escapedSuffix = regexProofString(suffix);
    const re = capturePrefixAndSuffix
        ? `(${escapedPrefix}.+?${escapedSuffix})`
        : `${escapedPrefix}(.+?)${escapedSuffix}`;

    return new RegExp(re);
}

/**
 * @param {ReactElement} element
 * @param {Number} tokenIndex - index of token in i18next value string
 * @return {String} a string suitable for use as a ReactElement key
 */
function getKeyForElement(element, tokenIndex) {
    if (!element || tokenIndex === undefined) {
        throw new Error(`getKeyForElement() must be provided element and tokenIndex`);
    }

    return md5(JSON.stringify({
        ...element.props,
        __position: tokenIndex
    }));
}

export {
    buildRegexFromOptions,
    getKeyForElement,
    regexProofString
};
