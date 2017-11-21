const path = require('path');
const StaticComponentEnveloper = require('./webpack/static-component-enveloper');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ReplaceInFile = require('./webpack/replace-in-file-webpack-plugin');

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: './js/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].js'
    },
    plugins: [
        new StaticComponentEnveloper(),
        new CopyWebpackPlugin([
            {
                from: 'css/**/*',
            }
        ]),
        new ReplaceInFile([{
            dir: 'dist',
            test: [/.css$/i, /.json$/i, /.js$/i],
            rules: [{
                search: /{{STATIC_PREFIX}}/gi,
                replace: 'http://localhost:8080'
            }]
        }])
    ]
}
//http://localhost:8080
