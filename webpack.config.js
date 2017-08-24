let webpackConfig = {
    module: {
        rules: [{
            exclude: /node_modules/,
            test: /\.js$/,
            use: `babel-loader`
        }]
    }
};

switch (process.env.NODE_ENV) {

    case `example`:
        webpackConfig = Object.assign({}, webpackConfig, {
            devServer: {
                contentBase: './example',
                port: 8080
            },
            entry: './example/index.js',
            output: {
                filename: 'example.js'
            }
        });

        break;

    case `production`:
        webpackConfig = Object.assign({}, webpackConfig, {
            entry: './src/index.js',
            externals: {
                i18next: {
                    amd: 'i18next',
                    commonjs: 'i18next',
                    root: 'i18next'
                },
                react: {
                    amd: 'react',
                    commonjs: 'react',
                    root: 'React'
                }
            },
            node: false,
            output: {
                filename: './lib/index.js'
            }
        });

        break;

    default:
}

module.exports = webpackConfig;
