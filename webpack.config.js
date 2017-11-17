const path = require('path');
const StaticComponentEnveloper = require('./webpack/static-component-enveloper');

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: './js/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    plugins: [
        new StaticComponentEnveloper()
    ]
}
