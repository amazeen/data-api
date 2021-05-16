const expect = require('chai').expect

const { getAreaById, getAreas, getSilosByAreaId, getThresholdsBySiloId, updateThresholdsBySiloId} = require('../decorators/postgres')

describe('postgres decorator', function() {

    describe('getAreas()', function() {

        it('should not throw with no connection to the database', async function() {

            try{
                await getAreas()
            }
            catch(err) {
                expect.fail('the function threw an error')
            }
        })

        it('should return a falsy value when an error occurs', async function() {

            const areas = await getAreas()
            expect(areas).to.satisfy(() => !areas, 'areas is not falsy')
        })
    })
    
    describe('getAreasById()', function() {

        const area = 1

        it('should not throw with no connection to the database', async function() {

            try{
                await getAreaById(area)
            }
            catch(err) {
                expect.fail('the function threw an error')
            }
        })

        it('should return a falsy value when an error occurs', async function() {

            const _area = await getAreaById(area)
            expect(_area).to.satisfy(() => !_area, 'area is not falsy')
        })
    })

    describe('getSilosByAreaId()', function() {

        const area = 1

        it('should not throw with no connection to the database', async function() {

            try{
                await getSilosByAreaId(area)
            }
            catch(err) {
                expect.fail('the function threw an error')
            }
        })

        it('should return a falsy value when an error occurs', async function() {

            const silos = await getSilosByAreaId(area)
            expect(silos).to.satisfy(() => !silos, 'silos is not falsy')
        })
    })

    describe('getThresholdsBySiloId()', function() {

        const silo = 1

        it('should not throw with no connection to the database', async function() {

            try{
                await getThresholdsBySiloId(silo)
            }
            catch(err) {
                expect.fail('the function threw an error')
            }
        })

        it('should return a falsy value when an error occurs', async function() {

            const thresholds = await getThresholdsBySiloId(silo)
            expect(thresholds).to.satisfy(() => !thresholds, 'thresholds is not falsy')
        })
    })

    describe('updateThresholdsBySiloId()', function() {

        const silo = 1
        const thresholds = [{}, {}]

        it('should not throw with no connection to the database', async function() {

            try{
                await updateThresholdsBySiloId(silo, thresholds)
            }
            catch(err) {
                expect.fail('the function threw an error')
            }
        })

        it('should return a falsy value when an error occurs', async function() {

            const _thresholds = await updateThresholdsBySiloId(silo, thresholds)
            expect(_thresholds).to.satisfy(() => !_thresholds, 'thresholds is not falsy')
        })
    })
})
