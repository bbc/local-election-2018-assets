const fs = require('fs');

const VALID_COMPONENT_SECTIONS = ['--head.html', '--body.html', '--body-last.html'];

const isFileComponentSection = (file) => {
    for (let i = 0; i < VALID_COMPONENT_SECTIONS.length; i++) {
        const componentSection = VALID_COMPONENT_SECTIONS[i];
        if (file.endsWith(componentSection)) {
            return true;
        }
    }
    return false;
};

const getComponentNameFromFile = (file) => {
    for (let i = 0; i < VALID_COMPONENT_SECTIONS.length; i++) {
        const componentSection = VALID_COMPONENT_SECTIONS[i];
        if (file.endsWith(componentSection)) {
            return file.slice(0, -componentSection.length);
        }
    }
};

const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
};

const getComponentSectionFiles = async ({directory}) => {
    return new Promise((resolve) => {
        fs.readdir(directory, (err, files) => {
            resolve(files.filter(isFileComponentSection));
        });
    });
}

const getComponents = async ({directory}) => {
    const compoentSectionFiles = await getComponentSectionFiles({directory});
    return compoentSectionFiles
        .map(getComponentNameFromFile)
        .filter(onlyUnique);
};

module.exports.getComponents = getComponents;
module.exports.getComponentSectionFiles = getComponentSectionFiles;
