const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const StaticComponentEnveloper = require('./webpack/static-component-enveloper');

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: './js/main.js',
    devtool: 'source-map',
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'http://localhost:8080/',
    },
    module: {
        rules: [{
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            minimize: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ],
            }),
        }],
    },
    plugins: [
        new StaticComponentEnveloper({
            test: /\.html$/, // Which files should be turned into components)
            // How to turn a file matched with test into a component name. (accepts a Function or String)
            componentName: fileName => fileName.match(/(.*)\.html$/)[1],
            includeJs: true, // Should the JS bundle be included.
            hash: true, // Include a unique hash per build to cachebust assets
        }),
        new ExtractTextPlugin('style.css'),
    ],
}
