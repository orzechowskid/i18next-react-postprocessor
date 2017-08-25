import i18next from 'i18next';
import React from 'react';
import ReactDOM from 'react-dom';

import ReactPostprocessor from '../src/index.js';

function t(key, opts) {
    return i18next.t(key, {
        ...opts,
        postProcess: `reactPostprocessor`
    });
}

class ExampleComponent extends React.Component {
    render() {
        return (
            <div>
                {t(`text`, {
                     name: `Alice`,
                     clickHere: (
                         <span
                             onClick={() => console.log(`click`)}
                             style={{cursor: `pointer`}}
                         >
                             {t(`clickMe`)}
                         </span>
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
                    text: `hello, {{name}}, <clickHere> and you will get a message in your console .`
                }
            },
            fr: {
                translation: {
                    clickMe: `cliquez-moi`,
                    text: `bonjour, {{name}}, <clickHere> et voila.`
                }
            }
        }
    }, function() {
        ReactDOM.render((
            <ExampleComponent />
        ), document.getElementById(`app`));
    });
