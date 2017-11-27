import assert from 'assert'
import includedDep from '../src/js/include';

describe('include', function(){
    it('should return the string `test`', () => {
        assert(includedDep() === 'test');
    });

    it('should not return a number', () => {
        assert(isNaN(includedDep()));
    });
});
