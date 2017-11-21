const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const StaticComponentEnveloper = require('./webpack/static-component-enveloper');
const ReplaceInFile = require('./webpack/replace-in-file-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: './js/main.js',
    devtool: 'source-map',
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'http://localhost:8080/'
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
            })
        }]
    },
    plugins: [
        new StaticComponentEnveloper({
            includeJs: true
        }),
        new ExtractTextPlugin('style.css')
    ]
}
