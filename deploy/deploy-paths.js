const package = require('../package.json');

const getSlingPath = () => {
    return `include/${package.slingTeam}/static-components/${package.name}/${package.version}/`;
};

const getSlingPublicPath = () => {
    if (process.env.SLING_ENV === 'test') {
        return `https://news.test.files.bbci.co.uk/${getSlingPath()}`;
    }
    else if (process.env.SLING_ENV === 'live') {
        return `https://news.files.bbci.co.uk/${getSlingPath()}`;
    }

    throw new Error('Invalid SLING_ENV set.')
};

const getPublicPath = () => {
    if (process.env.NODE_ENV !== 'production') {
        return 'http://localhost:8080/';
    }

    return getSlingPublicPath();

    throw new Error('Invalid SLING_ENV set.')
};

module.exports.getSlingPath = getSlingPath;
module.exports.getPublicPath = getPublicPath;
module.exports.getSlingPublicPath = getSlingPublicPath;
