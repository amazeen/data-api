const parameterValidator = {
  schema: {
    body: {
      type: 'object',
      required: ['type', 'value'],
      properties: {
        type:   { type: 'string', enum: ['temperature', 'capacity', 'pressure', 'humidity'] },
        value:  { type: 'number' },
        active: { type: 'boolean' },
      }
    },
    response: {
      '2xx': {
        type: 'object',
        properties: {
          humidity:    { type: 'number' },
          capacity:    { type: 'number' },
          pressure:    { type: 'number' },
          temperature: { type: 'number' },
        }
      }
    }
  }
}

module.exports = { parameterValidator }
