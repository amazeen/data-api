const { InfluxDB, flux, Point } = require('@influxdata/influxdb-client')

const url    = process.env.INFLUXDB_URL
const bucket = process.env.INFLUXDB_BUCKET || ''
const org    = process.env.INFLUXDB_ORG
const token  = process.env.INFLUXDB_TOKEN

const createReader = () => new InfluxDB({url, token}).getQueryApi(org)
const createWriter = () => new InfluxDB({url, token}).getWriteApi(org, bucket)

const getHistory = async (silo) => {

    //TODO: limit values further?
    const query = flux`
        from(bucket: ${bucket})
            |> range(start: -7d)
            |> filter(fn: (r) => r._measurement == "scalar" and r.silo == ${silo})
            |> aggregateWindow(every: 1h, fn: mean)
            |> keep(columns: ["_time", "_field", "_value"])
            |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
            |> sort(columns: ["_time"], desc: true)
            |> rename(columns: {"_time": "time"})
        `

    try{
        const reader = await createReader()
        const rows = await reader.collectRows(query)
        return rows
    }
    catch(err) {
        console.warn('Error reading history: '+ err)
        return false
    }
}

const getParameters = async (silo) => {

    const query = flux`
        from(bucket: ${bucket})
            |> range(start: -1h)
            |> filter(fn: (r) => r._measurement == "scalar" and r.silo == ${silo})
            |> last(column: "_time")
            |> keep(columns: ["_field", "_value"])
            |> pivot(rowKey: [], columnKey: ["_field"], valueColumn: "_value")
        `

    try{
        const reader = await createReader()
        const rows = await reader.collectRows(query)
        return rows[0]
    }
    catch(err) {
        console.warn('Error reading parameters: '+ err)
        return false
    }
}
    
const getLastActiveCapacityFraction = async (silo) => {

    const query = flux`
        from(bucket: ${bucket})
            |> range(start: -1h, stop: 1s)
            |> filter(fn: (r) => r._measurement == "fraction" and r.silo == ${silo})
            |> pivot(rowKey: ["_time"], columnKey: ["_field"], valueColumn: "_value")
            |> keep(columns: ["_time", "active", "fraction", "type"])
            |> filter(fn: (r) => r.type == "capacity")
            |> sort(columns: ["_time"], desc: true)
            |> unique(column: "fraction")
            |> filter(fn: (r) => r.active == true)
            |> max(column: "fraction")
        `

    const reader = await createReader()
    const rows = await reader.collectRows(query)
    return rows[0]?.fraction ?? 0
} 

const storeFractionAndGetScalar = async (area, silo, type, value, active) => {

    if(type !== 'capacity') throw 'storeFractionAndGetScalar() Not implemented for type ' + type

    const point = new Point('fraction')
        .tag('area', area)
        .tag('silo', silo)
        .stringField('type', type)
        .floatField('fraction', value)
        .booleanField('active', active)

    const writer = await createWriter()
    await writer.writePoint(point)
    await writer.close()
    
    return (await getLastActiveCapacityFraction(silo))
}

const insertParameter = async (area, silo, type, value, active) => {

    let fieldValue = value

    try{
        if(type == 'capacity') fieldValue = await storeFractionAndGetScalar(area, silo, type, value, active)

        const point = new Point('scalar')
            .tag('area', area)
            .tag('silo', silo)
            .floatField(type, fieldValue)

        const writer = await createWriter()
        await writer.writePoint(point)
        writer.close()

        return true
    }
    catch(err) {
        console.warn('Error writing point: '+ err)
        return false
    }
    
}

module.exports = {getHistory, getParameters, insertParameter}
