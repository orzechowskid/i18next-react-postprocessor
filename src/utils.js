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
 * @return {String} a string suitable for use as a ReactElement key
 */
function getKeyForElement(element) {
    if (!element) {
        throw new Error(`getKeyForElement() requires an element`);
    }

    return md5(JSON.stringify({
        ...element.props,
        __element: String(element)
    }));
}

export {
    buildRegexFromOptions,
    getKeyForElement,
    regexProofString
};
