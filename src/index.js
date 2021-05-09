require('dotenv').config()

const fastify = require('fastify')({logger: true})

fastify.decorate('auth', require('./decorators/roles'))
fastify.decorate('db', {
    config: require('./decorators/postgres'),
    data:   require('./decorators/influx')
})  

//fastify.register(require('fastify-cors'),   {origin: '*'})
fastify.register(require('./routes'))

fastify.listen(3000, '0.0.0.0', (err, address) => {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
    fastify.log.info(`server listening on ${address}`)
})
