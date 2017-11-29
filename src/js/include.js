// This file is just an example showing that you can
// use ES6 features, they'll get transpiled using babel so,
// will work on older browsers.
//
// YOU CAN DELETE THIS FILE IN YOUR OWN COMPONENT

class ES6ClassInclude {
    constructor() {
        console.log('Object init');
        [1, 2].forEach(value => console.log(`Number: ${value}`));
    }
}


module.exports = () => {
    const es6Object = new ES6ClassInclude();
    return 'test';
};
