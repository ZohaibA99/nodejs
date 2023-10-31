const pow = require('./pow');

describe('hooks', function(){
    beforeEach(() => {
        console.log('run before each test');
    })
    afterAll(() => {
        console.log('tests finished');
    })
    test('1 to the power of 0', () => {
        console.log('1 to the power of 0 to equal 1');
        expect(pow(1, 0)).toBe(1);
    }) 

    test('(1) to the power of 2', () => {
        console.log('1 to the power of 2 to equal 1');
        expect(pow(1, 2)).toBe(1);
    }) 
})