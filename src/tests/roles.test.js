const expect = require('chai').expect

const { canCreate, canRead, canUpdate } = require('../decorators/roles')

describe('roles decorator', function() {

    describe('canCreate()', function() {

        it('should not throw with empty header', async function() {

            const req = { headers: {} }

            try{
                await canCreate(req)
            }
            catch(err) {
                expect.fail('the function threw an error')
            }
        })

        it('should return true when create is present in the header', async function() {

            const req = { headers: {'x-auth-permissions': 'create'} }

            const result = await canCreate(req)
            expect(result).to.be.true

        })

        it('should return false when create is not present in the header', async function() {

            const req = { headers: {'x-auth-permissions': 'read'} }

            const result = await canCreate(req)
            expect(result).to.be.false

        })
    })  
    
    describe('canRead()', function() {

        it('should not throw with empty header', async function() {

            const req = { headers: {} }

            try{
                await canRead(req)
            }
            catch(err) {
                expect.fail('the function threw an error')
            }
        })

        it('should return true when read is present in the header', async function() {

            const req = { headers: {'x-auth-permissions': 'read'} }

            const result = await canRead(req)
            expect(result).to.be.true

        })

        it('should return false when read is not present in the header', async function() {

            const req = { headers: {'x-auth-permissions': ''} }

            const result = await canRead(req)
            expect(result).to.be.false

        })
    })

    describe('canUpdate()', function() {

        it('should not throw with empty header', async function() {

            const req = { headers: {} }

            try{
                await canUpdate(req)
            }
            catch(err) {
                expect.fail('the function threw an error')
            }
        })

        it('should return true when update is present in the header', async function() {

            const req = { headers: {'x-auth-permissions': 'create, update'} }

            const result = await canUpdate(req)
            expect(result).to.be.true

        })

        it('should return false when update is not present in the header', async function() {

            const req = { headers: {'x-auth-permissions': 'create, read'} }

            const result = await canUpdate(req)
            expect(result).to.be.false

        })
    })
})
