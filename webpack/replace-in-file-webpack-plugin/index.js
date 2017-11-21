const path = require('path');
const fs = require('fs');

const getReplacement = (input, rules) => {
    return rules.reduce((output, rule) => {
        return output.replace(rule.search, rule.replace);
    }, input);
};

const replaceInFile = (file, rules) => {
    const fileContents = file.source().toString();
    const newFileContents = getReplacement(fileContents, rules);

    file.source = () => {
        return newFileContents;
    };

    file.size = () => {
        return newFileContents.length;
    };
};

class ReplaceInFilePlugin {

    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
        compiler.plugin('emit', (compilation, callback) => {
            this.options.forEach(option => {
                const test = option.test;
                const testArray = Array.isArray(test) ? test : [test];

                const files = compilation.assets;
                const fileList = Object.keys(files);

                fileList.forEach(file => {
                    const match = testArray.some((test, index, array) => {
                        return test.test(file);
                    });

                    if (!match) {
                        return;
                    }

                    replaceInFile(files[file], option.rules);
                });

                callback();
            })
        });
    }
}

module.exports = ReplaceInFilePlugin;
