const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const deployPaths = require('./deploy/deploy-paths');
const StaticComponentEnveloper = require('./webpack/static-component-enveloper');

const extractCoreCss = new ExtractTextPlugin('core.css');
const extractEnhancedCss = new ExtractTextPlugin('enhanced.css');

const sassExtractOptions = {
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
    ]
};



module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: './js/main.js',
    devtool: 'source-map',
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: deployPaths.getPublicPath(),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            {
                test: /core\.scss$/,
                use: extractCoreCss.extract(sassExtractOptions),
            },
            {
                test: /enhanced\.scss$/,
                use: extractEnhancedCss.extract(sassExtractOptions),
            }
        ],
    },
    plugins: [
        new StaticComponentEnveloper({
            test: /\.html$/, // Which files should be turned into components)
            // How to turn a file matched with test into a component name. (accepts a Function or String)
            componentName: fileName => fileName.match(/(.*)\.html$/)[1],
            includeJs: true, // Should the JS bundle be included automatically.
            includeCss: false, // Should the CSS bundles be included automatically.
            hash: true, // Include a unique hash per build to cachebust assets
            injectHead: path.resolve(__dirname, 'src/enhanced-css.inc'), // A template to inject in the head
            minify: true, // Should we minfify the HTML output
        }),
        extractCoreCss,
        extractEnhancedCss
    ],
}
