const expect = require('chai').expect

const { getHistory, getParameters, insertParameter, getLastCapacityScalar} = require('../decorators/influx')

describe('influx decorator', function() {

    describe('getHistory()', function() {

        const silo = 1

        it('should not throw with no connection to the database', async function() {

            try{
                await getHistory(silo)
            }
            catch(err) {
                console.log(err)
                expect.fail('the function threw an error')
            }
        })

        it('should return a falsy value when an error occurs', async function() {

            const history = await getHistory(silo)
            expect(history).to.satisfy(() => !history, 'history is not falsy')
        })
    })
    
    describe('getParameters()', function() {

        const silo = 1

        it('should not throw with no connection to the database', async function() {

            try{
                await getParameters(silo)
            }
            catch(err) {
                expect.fail('the function threw an error')
            }
        })

        it('should return a falsy value when an error occurs', async function() {

            const parameters = await getParameters(silo)
            expect(parameters).to.satisfy(() => !parameters, 'parameters is not falsy')
        })
    })

    describe('getLastCapacityScalar()', function() {

        const silo = 1

        it('should not throw with no connection to the database', async function() {

            try{
                await getLastCapacityScalar(silo)
            }
            catch(err) {
                expect.fail('the function threw an error')
            }
        })

        it('should return a falsy value when an error occurs', async function() {

            const parameters = await getLastCapacityScalar(silo)
            expect(parameters).to.satisfy(() => !parameters, 'parameters is not falsy')
        })
    })

    describe('insertParameter()', function() {

        const silo = 1
        const parameter = {}

        it('should not throw with no connection to the database', async function() {

            try{
                await insertParameter(silo)
            }
            catch(err) {
                expect.fail('the function threw an error')
            }
        })

        it('should return a falsy value when an error occurs', async function() {

            const result = await insertParameter(silo)
            expect(result).to.satisfy(() => !result, 'result is not falsy')
        })
    })

})
