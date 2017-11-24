const package = require('../package.json');

const slingEnv = process.env.SLING_ENV;
const nodeEnv = process.env.NODE_ENV;

const getSlingPath = () => {
    return `include/${package.slingTeam}/static-components/${package.name}/${package.version}/`;
};

const getSlingPublicPath = () => {
    if (slingEnv === 'test') {
        return `https://news.test.files.bbci.co.uk/${getSlingPath()}`;
    }
    else if (slingEnv === 'live') {
        return `https://news.files.bbci.co.uk/${getSlingPath()}`;
    }

    throw new Error(`Invalid SLING_ENV set (${slingEnv}).`)
};

const getPublicPath = () => {
    if (nodeEnv === 'production' && typeof slingEnv !== 'undefined') {
        return getSlingPublicPath();
    }

    return 'http://localhost:8080/'
};

module.exports.getSlingPath = getSlingPath;
module.exports.getPublicPath = getPublicPath;
module.exports.getSlingPublicPath = getSlingPublicPath;
