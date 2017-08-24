import i18next from 'i18next';
import React from 'react';
import ReactDOM from 'react-dom';

import ReactPostprocessor from '../src/index.js';

function t(key, opts) {
    return i18next.t(key, Object.assign({}, opts, {
        postProcess: `reactPostprocessor`
    }));
}

class ExampleComponent extends React.Component {
    render() {
        return (
            <div>
                {t(`text`, {
                     name: `Alice`,
                     clickHere: (
                         <a
                             href="//www.example.com"
                             onClick={() => console.log(`click`)}
                         >
                             {t(`clickMe`)}
                         </a>
                     )
                })}
            </div>
        );
    }
}

i18next
    .use(new ReactPostprocessor())
    .init({
        lng: `en`,
        resources: {
            en: {
                translation: {
                    clickMe: `click me`,
                    text: `hello, {{name}}, <clickHere> and you will be taken to example.com .`
                }
            },
            fr: {
                translation: {
                    clickMe: `cliquez-moi`,
                    text: `bonjour, {{name}}, <clickHere> et voila, example.com .`
                }
            }
        }
    }, function() {
        ReactDOM.render((
            <ExampleComponent />
        ), document.getElementById(`app`));
    });
