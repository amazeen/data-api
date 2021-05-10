  
const { Pool } = require('pg')
const parse = require('pg-connection-string').parse

const config = parse(process.env.POSTGRESQL_URL)
if(process.env.POSTGRESQL_SSL) config.ssl = { ...config.ssl, rejectUnauthorized: false }

const pool = new Pool(config)

const getAreas = async () => {
    try {
        const result = await pool.query('SELECT * FROM areas;')
        return result.rows
    }
    catch(err) {
        console.warn('Error retrieveing areas: ' + err)
        return false
    }
}

const getAreaById = async (area) => {
    try {
        const result = await pool.query('SELECT * FROM areas a WHERE id = $1;',[area])
        return result.rowCount > 0 ? result.rows[0] : null
    }
    catch(err) {
        console.warn('Error retrieveing area: ' + err)
        return false
    }
}

const getSilosByAreaId = async (area) => {
    try {
        const result = await pool.query('SELECT * FROM silos WHERE area_id = $1;', [area])
        return result.rows
    }
    catch(err) {
        console.warn('Error retrieveing silo: ' + err)
        return false
    }
}

const getThresholdsBySiloId = async (silo) => {
    try {
        const result = await pool.query('SELECT * FROM thresholds WHERE silo_id = $1;', [silo])
        return result.rows
    }
    catch(err) {
        console.warn('Error retrieveing thresholds: ' + err)
        return false
    }
}

const updateThresholdsBySiloId = async (silo, thresholds) => {
    try {
        const result = Promise.all(thresholds.map(async (threshold) => {
            const query = 'UPDATE thresholds SET minimum = $1, maximum = $2 WHERE silo_id = $3 AND type = $4 RETURNING *;'
            const result = await pool.query(query, [threshold.minimum, threshold.maximum, silo, threshold.type])
            return result.rows[0]
        }))

        return result
    }
    catch(err) {
        console.warn('Error updating thresholds: ' + err)
        return false
    }
}

module.exports = {
    getAreas,
    getAreaById,
    // getSiloById,
    getSilosByAreaId,
    getThresholdsBySiloId,
    updateThresholdsBySiloId
}
