module.exports = async (fastify, options) => {
    
    const config = fastify.db.config
    const data   = fastify.db.data
    const auth   = fastify.auth
    const bus    = fastify.bus
    
    const { areaValidator }           = require('./validators/area')
    const { historyValidator }        = require('./validators/history')
    const { parameterValidator }      = require('./validators/parameter')
    const { thresholdArrayValidator } = require('./validators/threshold')

    //TODO: send rabbitmq messages 

    fastify.register(async (fastify) => {
        
        fastify.addHook('preValidation', async (req, res) => {
            if(!auth.canRead(req)) return res.status(401).send()
        })

        fastify.get('/', async(req, res) => {

            const areas = await config.getAreas()
            if(!areas) return res.status(500).send()

            return {
                areas: areas.map(area => area.id)
            }
        })

        fastify.get('/area/:area', areaValidator, async(req, res) => {
            const area = req.params.area

            const _area = await config.getAreaById(area)
            if(!_area) return res.status(404).send()

            const silos = await config.getSilosByAreaId(area)
            if(!silos) return res.status(500).send()

            return {
                id: area,
                silos: silos.map(silo => silo.id)
            }
        })

        fastify.get('/area/:area/silo/:silo/thresholds', {schema: {response: thresholdArrayValidator.schema.response}}, async(req, res) => {
            const silo = req.params.silo

            const result = await config.getThresholdsBySiloId(silo)

            if(!result) return res.status(500).send()

            return result
        })
        
        fastify.get('/area/:area/silo/:silo/parameters', {schema: {response: parameterValidator.schema.response}}, async(req, res) => {
            const silo = req.params.silo

            const result = await data.getParameters(silo)
            if(!result) return res.status(500).send()

            return result
        })

        fastify.get('/area/:area/silo/:silo/history', historyValidator, async(req, res) => {
            const silo = req.params.silo

            const result = await data.getHistory(silo)
            if(!result) return res.status(500).send()

            return result
        })
    })

    fastify.register(async (fastify) => {

        fastify.addHook('preValidation', async (req, res) => {
            if(!auth.canCreate(req)) return res.status(401).send()
        })

        fastify.post('/area/:area/silo/:silo/parameters', {schema: {body: parameterValidator.schema.body}}, async(req, res) => {
            
            const area   = req.params.area
            const silo   = req.params.silo
            const type   = req.body.type
            const value  = req.body.value
            const active = req.body.active

            const result = await data.insertParameter(area, silo, type, value, active)
            if(!result) return res.status(500).send()

            processThreshold(area, silo, type, value, active)

            return res.status(201).send()
        })

        const processThreshold = async (area, silo, type, value, active) => {

            try{
                bus.sendParameterReading(area, silo, type, value, active)

                const thresholds = await config.getThresholdsBySiloId(silo)
                const threshold = thresholds.find(x => x.type === type)

                if(type == 'capacity') value = await data.getLastCapacityScalar(silo)

                if(value < threshold.minimum || value > threshold.maximum) bus.sendParameterAboveThreshold(area, silo, type, value)
            }
            catch(err) {
                console.warn(err)
            }
        }
    })

    fastify.register(async (fastify) => {

        fastify.addHook('preValidation', async (req, res) => {
            if(!auth.canUpdate(req)) return res.status(401).send()
        })

        fastify.put('/area/:area/silo/:silo/thresholds', thresholdArrayValidator, async(req, res) => {
            const silo = req.params.silo
            const thresholds = req.body

            const result = await config.updateThresholdsBySiloId(silo, thresholds)
            if(!result) return res.status(500).send()

            return result
        })
    })
}
