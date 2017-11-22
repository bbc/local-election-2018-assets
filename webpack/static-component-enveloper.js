const path = require('path');
const fs = require('fs');
const getComponents = require('./getComponents');

class StaticComponentEnveloper {

    constructor(options) {
        // Turn on JS by default
        if (typeof options.includeJs === 'undefined') {
            options.includeJs = true;
        }

        this.options = options;
    }

    apply(compiler) {
        compiler.plugin('emit', async (compilation, callback) => {
            const srcDir = compiler.options.context;
            const components = await getComponents({
                directory: srcDir,
                test: this.options.test,
                componentName: this.options.componentName
            });

            await Promise.all(components.map(this.buildComponentEnvelope.bind(this, srcDir, compilation)));

            this.components = components;

            callback();
        });

        compiler.plugin('after-emit', (compilation, callback) => {
            const srcDir = compiler.options.context;
            const filesFullPath = this.components.map((component) => {
                return  `${srcDir}/${component.file}`;
            });

            filesFullPath.forEach((file) => {
                if (!compilation.fileDependencies.hasOwnProperty(file)) {
                    compilation.fileDependencies.push(file);
                }
            });

            if (!compilation.contextDependencies.hasOwnProperty(srcDir)) {
                compilation.contextDependencies.push(srcDir);
            }

            callback();
        });
    }

    async buildComponentEnvelope(srcDir, compilation, component) {
        const rawChunks = compilation.getStats().toJson().chunks;
        const chunks = this.sortChunks(this.filterChunks(rawChunks));
        const assets = this.getAssets({compilation, chunks});

        const componentEnvelope = {
            head: this.getComponentHead({assets}),
            bodyInline: await this.getComponentBody({srcDir, component}),
            bodyLast: this.getComponentBodyLast({assets})
        };

        const envelopeJson = JSON.stringify(componentEnvelope);

        compilation.assets[`${component.name}.json`] = {
            source: function() {
                return envelopeJson;
            },
            size: function() {
                return envelopeJson.length;
            }
        };
    }

    // Currently all CSS files are placed in the head.
    getComponentHead({assets}) {
        return assets.css.map((cssFile) => {
            return `<link href="${cssFile}" rel="stylesheet"/>`;
        });
    }

    // Currently all JS files are placed in the bodyLast section.
    getComponentBodyLast({assets}) {
        // If we want to exclue JS return a blank array.
        if (this.options.includeJs !== true) {
            return [];
        }

        return assets.js.map((jsFile) => {
            return `<script type="text/javascript" src="${jsFile}"></script>`;
        });
    }

    async getComponentBody({component, srcDir}) {
        return new Promise((resolve, reject) => {
            const sectionPath = path.resolve(srcDir, component.file);
            fs.readFile(sectionPath, 'utf-8', (err, html) => {
                if (err) {
                    reject('Error reading component file.');
                }
                else {
                    resolve(html);
                }
            });
        });
    }

    /*
     * Taken and modified from html-webpack-plugin
     * https://github.com/jantimon/html-webpack-plugin/blob/0cf580c628a495d77b85e35ed1b9d244e2ec5ae0/index.js#L355
    */
    filterChunks(chunks, includedChunks, excludedChunks) {
        return chunks.filter((chunk) => {
            var chunkName = chunk.names[0];
            // This chunk doesn't have a name. This script can't handled it.
            if (chunkName === undefined) {
                return false;
            }
            // Skip if the chunk should be lazy loaded
            if (typeof chunk.isInitial === 'function') {
                if (!chunk.isInitial()) {
                    return false;
                }
            } else if (!chunk.initial) {
                return false;
            }
            // Skip if the chunks should be filtered and the given chunk was not added explicity
            if (Array.isArray(includedChunks) && includedChunks.indexOf(chunkName) === -1) {
                return false;
            }
            // Skip if the chunks should be filtered and the given chunk was excluded explicity
            if (Array.isArray(excludedChunks) && excludedChunks.indexOf(chunkName) !== -1) {
                return false;
            }
            // Add otherwise
            return true;
        });
    }

    sortChunks(chunks) {
        return chunks.sort(function orderEntryLast (a, b) {
            if (a.entry !== b.entry) {
                return b.entry ? 1 : -1;
            } else {
                return b.id - a.id;
            }
        });
    }

    getPublicPath({compilation}) {
        const compilationHash = compilation.hash;
        let publicPath = '/';
        // Use public path if it's set
        if (typeof compilation.options.output.publicPath !== 'undefined') {
            publicPath = compilation.mainTemplate.getPublicPath({hash: compilationHash});
        }

        // Add / to send of public path if it doesn't exist.
        if (publicPath.length && publicPath.substr(-1, 1) !== '/') {
            publicPath += '/';
        }

        return publicPath;
    }

    getAssets({chunks, compilation}) {
        const compilationHash = compilation.hash;
        const publicPath = this.getPublicPath({compilation});
        const assets = {
            js: [],
            css: []
        };

        chunks.forEach((chunk) => {
            // Prepend the public path to all chunk files
            const chunkFiles = [].concat(chunk.files).map((chunkFile) => {
                const urlWithPublicPath = publicPath + chunkFile;
                if (this.options.hash) {
                    return this.appendHash({url: urlWithPublicPath, hash: compilationHash});
                }
                return urlWithPublicPath;
            });

            // Webpack outputs the JS file as the first chunk
            const entry = chunkFiles[0];
            assets.js.push(entry);

            // Gather all css files
            const css = chunkFiles.filter((chunkFile) => {
                return /.css($|\?)/.test(chunkFile);
            });
            assets.css = assets.css.concat(css);
        })

        // Duplicate css assets can occur on occasion if more than one chunk
        // requires the same css.
        assets.css = assets.css.filter(this.onlyUnique);

        return assets;
    }

    appendHash({url, hash}) {
        if (!url) {
            return url;
        }
        return url + (url.indexOf('?') === -1 ? '?' : '&') + hash;
    }

    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

}

module.exports = StaticComponentEnveloper;
