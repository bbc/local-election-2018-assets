const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StaticComponentEnveloper = require('@bbc/webpack-static-component-enveloper-plugin');

const getPublicPath = () => {
    const slingEnv = process.env.SLING_ENV;
    const nodeEnv = process.env.NODE_ENV;
    if (nodeEnv === 'production' && typeof slingEnv !== 'undefined') {
        const staticComponentDeployer = require('@bbc/static-component-deployer');
        return staticComponentDeployer.getSlingPublicPath(slingEnv);
    }
    return 'http://localhost:8080/';
}

module.exports = {
    resolve : {
        modules: [path.resolve(__dirname, "vendor/bower"), "node_modules"]
    },
    context: path.resolve(__dirname, 'src'),
    entry: './js/main.js',
    devtool: 'source-map',
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: getPublicPath(),
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
            }
        ],
    },
    plugins: [
        new StaticComponentEnveloper({
            test: /\.html$/, // Which files should be turned into components)
            // How to turn a file matched with test into a component name. (accepts a Function or String)
            componentName: fileName => fileName.match(/(.*)\.html$/)[1],
            includeJs: true, // Should the JS bundle be included automatically.
            includeCss: true, // Should the CSS bundles be included automatically.
            hash: true, // Include a unique hash per build to cachebust assets
            injectHead: undefined, // A template to inject in the head
            minify: true, // Should we minfify the HTML output
        }),
        new ExtractTextPlugin('style.css')
    ],
}
