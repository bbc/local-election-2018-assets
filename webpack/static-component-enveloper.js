const getComponents = require('./getComponents');
const fs = require('fs');

const VALID_COMPONENT_SECTIONS = {
    head: {
        fileSuffix: '--head.html',
        isArray: true
    },
    bodyInline: {
        fileSuffix: '--body.html',
        isArray: false
    },
    bodyLast: {
        fileSuffix: '--body-last.html',
        isArray: true
    }
};

class StaticComponentEnveloper {

    apply(compiler) {
        compiler.plugin('emit', async (compilation, callback) => {
            const srcDir = compiler.options.context;
            const components = await getComponents.getComponents({directory: srcDir});

            await Promise.all(components.map(this.buildComponentEnvelope.bind(this, srcDir, compilation)));
            callback();
        });

        compiler.plugin('after-emit', async (compilation, callback) => {
            const srcDir = compiler.options.context;
            const sectionFiles = await getComponents.getComponentSectionFiles({directory: srcDir});
            const sectionFilesFullPath = sectionFiles.map((file) => `${srcDir}/${file})`);
            sectionFilesFullPath.forEach((file) => {
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
        const sections = Object.keys(VALID_COMPONENT_SECTIONS);
        const componentSections = await Promise.all(sections.map(async (section) => {
            return this.getComponentSectionHtml({component, section, srcDir});
        }));

        const componentEnvelope = sections.reduce((envelope, section, index) => {
            const contentIsArrray = VALID_COMPONENT_SECTIONS[section].isArray;
            const sectionHtml = componentSections[index];
            const sectionContent = (contentIsArrray)? [sectionHtml] : sectionHtml;

            envelope[section] = sectionContent;

            return envelope;
        }, {});

        const envelopeJson = JSON.stringify(componentEnvelope);
        compilation.assets[`${component}.json`] = {
            source: function() {
                return envelopeJson;
            },
            size: function() {
                return envelopeJson.length;
            }
        };
    }

    async getComponentSectionHtml({component, section, srcDir}) {
        return new Promise((resolve) => {
            const fileSuffix = VALID_COMPONENT_SECTIONS[section].fileSuffix;
            const sectionPath = `${srcDir}/${component}${fileSuffix}`;
            fs.readFile(sectionPath, 'utf-8', (err, html) => {
                if (err) {
                    resolve('');
                }
                else {
                    resolve(html);
                }
            });
        });
    }

    async writeComponentEnvelope({component, componentEnvelope}) {
        return new Promise((resolve) => {
            const componentEnvelopeJson = JSON.stringify(componentEnvelope);

        });
    }
}

module.exports = StaticComponentEnveloper;
