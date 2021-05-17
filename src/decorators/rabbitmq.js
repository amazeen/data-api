const amqp = require('amqplib')

const url = process.env.RABBITMQ_URL || ''
const exchange = 'parameters'
const timeout = 5

let connection = null
let channel = null

const init = async () => {

    connection = null
    channel = null

    try{
        connection = await amqp.connect(url)
        channel = await connection.createChannel()
        channel.assertExchange(exchange, 'fanout', { durable: false })
    }
    catch(err) {
        console.warn('Error connecting to rabbitmq service, retriyng in %s seconds', timeout)
        setTimeout(init, timeout * 1000)
    }
}

const sendParameterReading = (area, silo, type, value) => {
    const msgType = 'parameter:reading'
    const data = {area, silo, type, value}
    sendMessage(msgType, data)
}

const sendParameterAboveThreshold = (area, silo, type, value, active) => {
    const msgType = 'parameter:threshold-reached'
    const data = {area, silo, type, value, active}
    sendMessage(msgType, data)
}

const sendMessage = async (type, data) => {
    
    if(!channel) return

    const message = JSON.stringify({type, data})

    try {
        channel.publish(exchange, '', Buffer.from(message))
    }
    catch(err) {
        console.warn('Error sending message to rabbitmq, reconnecting...')
        init()
    }
}

module.exports = {
    init,
    sendParameterAboveThreshold,
    sendParameterReading
}

