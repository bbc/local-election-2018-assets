class ES6ClassInclude {
    constructor() {
        console.log('Object init');
    }

    do() {
        [1, 2].forEach(value => console.log(`Number: ${value}`));
    }
}


module.exports = () => {
    console.log('We can import JS');
    const es6Object = new ES6ClassInclude();
    es6Object.do();
    return 'test';
};
