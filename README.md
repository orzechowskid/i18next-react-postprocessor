# i18next-react-postprocessor

embed React elements inside your i18next translation strings

# About

because sometimes you just want to dump some JSX into your l10n'd text and don't want to be bothered with the whole react-i18next dog-and-pony show.

# Getting Started

    $ cd my-project
    $ npm install --save i18next-react-postprocessor

# Usage

import the package in the usual way, and use a new instance of the class as i18next middleware:

    import i18next from 'i18next';
    import ReactPostprocessor from 'i18next-react-postprocessor';
    
    i18next
      .use(new ReactPostprocessor())
      .init();

then when it's time to render translated strings, make sure you set the `postProcess` option to 'reactPostprocessor':

    import i18next from 'i18next';
    import React from 'react';
    
    function MyComponent(props) {
      return (
        <div>
          {i18next.t(`myKey`, {
            postProcess: `reactPostprocessor`
          })}
        </div>
      );
    }

the postprocessor by default looks for tokens delimited by `<angleyBrackets>` to perform interpolation of React elements:

    i18next
      .use(new ReactPostprocessor())
      .init({
        lng: `en`,
        resources: {
          en: {
            translation: {
              myKey: `just <clickHere> to do the things`
            }
          },
          fr: {
            translation: {
              myKey: `<clickHere> et voila`
            }
          }
        }
      });

element interpolation is done just like regular ol' string interpolation:

    render() {
      return (
        <div>
          {i18next.t(`myKey`, {
            clickHere: ( <img onClick={() => console.log(`click!`)} src="pug.jpg" /> ),
            postProcess: `reactPostprocessor`
          })}
        </div>
      );
    }
    
# API

### ReactPostprocessor({opts})

    const middleware = new ReactPostprocessor({
      keepUnknownVariables: Boolean
      prefix: String
      suffix: String
    });
    
all fields are optional.

`keepUnknownVariables` controls whether or not to replace missing interpolation values with the empty string; it defaults to false (meaning the empty string is used).  `prefix` and `suffix` define the beginning and end of the interpolation token to look for; they default to '<' and '>' respectively.

# Development & Example App

    $ git clone https://www.github.com/orzechowskid/i18next-react-postprocessor
    $ npm install
    [ edit edit edit... ]
    $ npm run example
    $ open http://localhost:8080
    [ verify verify verify... ]
    $ npm run build:production

# Testing

a full test suite is located in src/\__tests__ .  `npm run test` should run `jest --verbose --coverage`.
