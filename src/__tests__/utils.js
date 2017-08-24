import {
    buildRegexFromOptions,
    getKeyForElement,
    regexProofString
} from '../utils.js';

describe(`the buildRegexFromOptions function`, function() {
    it(`builds a RegExp with 'prefix' at the start and 'suffix' at the end`, function() {
        const re = buildRegexFromOptions({
            prefix: `[`,
            suffix: `>>`
        });

        expect(re.toString()).toEqual(`/\\[(.+?)>>/`);
    });

    it(`builds a RegExp which captures a string with 'prefix' at the start and 'suffix' at the end when 'capturePrefixAndSuffix' is true`, function() {
        const re = buildRegexFromOptions({
            capturePrefixAndSuffix: true,
            prefix: `<`,
            suffix: `>`
        });

        expect(re.toString()).toEqual(`/(<.+?>)/`);
    });

    it(`throws if prefix or suffix is not provided`, function() {
        expect(function() {
            const rc = buildRegexFromOptions({
                prefix: `<`
            });
        }).toThrow();

        expect(function() {
            const rc = buildRegexFromOptions({
                suffix: `>`
            });
        }).toThrow();

        expect(function() {
            const rc = buildRegexFromOptions();
        }).toThrow();
    });
});

describe(`the getKeyForElement function`, function() {
    it(`returns the same value for two copies of the same object`, function() {
        const element1 = {
            props: {
                foo: `bar`
            }
        };
        const index1 = 1;
        const element2 = {
            props: {
                foo: `bar`
            }
        };
        const index2 = 1;

        expect(getKeyForElement(element1, index1)).toEqual(getKeyForElement(element2, index2));
    });

    it(`returns different values for different objects`, function() {
        const element1 = {
            props: {
                foo: `bar`
            }
        };
        const index1 = 1;
        const element2 = {
            props: {
                baz: `woz`
            }
        };
        const index2 = 1;

        expect(getKeyForElement(element1, index1)).not.toEqual(getKeyForElement(element2, index2));
    });

    it(`returns different values for the same object with different indices`, function() {
        const element1 = {
            props: {
                foo: `bar`
            }
        };
        const index1 = 1;
        const element2 = {
            props: {
                foo: `bar`
            }
        };
        const index2 = 2;

        expect(getKeyForElement(element1, index1)).not.toEqual(getKeyForElement(element2, index2));
    });

    it(`throws if 'element' or 'tokenIndex' are not provided`, function() {
        const element1 = {
            props: {
                foo: `bar`
            }
        };
        const index1 = 1;

        expect(function() {
            const rc = getKeyForElement(element1);
        }).toThrow();
        expect(function() {
            const rc = getKeyForElement(undefined, index1);
        }).toThrow();
        expect(function() {
            const rc = getKeyForElement();
        }).toThrow();
    });
});

describe(`the regexProofString function`, function() {
    it(`escapes all regex-meaningful characters in the given string`, function() {
        const str = `$$hello[world]`;

        expect(regexProofString(str)).toEqual(`\\$\\$hello\\[world\\]`);
    });

    it(`returns the input string when no regex-meaningful characters are present`, function() {
        const str = `dsfargeg`;

        expect(regexProofString(str)).toEqual(str);
    });
});
