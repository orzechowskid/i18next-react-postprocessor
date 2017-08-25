module.exports = {
    devServer: {
        contentBase: './example',
        port: 8080
    },
    entry: './example/index.js',
    module: {
        rules: [{
            exclude: /node_modules/,
            test: /\.js$/,
            use: `babel-loader`
        }]
    },
    output: {
        filename: 'example.js'
    }
};
