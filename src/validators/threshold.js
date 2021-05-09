const thresholdArrayValidator = {
  schema: {
    body: {
      type: 'array',
        items: {
        type: 'object',
        required: ['type', 'minimum', 'maximum'],
        properties: {
          type:     { type: 'string', enum: ['temperature', 'capacity', 'pressure', 'humidity'] },
          maximum:  { type: 'number' },
          minimum:  { type: 'number' },
        }
      }
    },
    response: {
      '2xx': {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type:     { type: 'string', enum: ['temperature', 'capacity', 'pressure', 'humidity'] },
            maximum:  { type: 'number' },
            minimum:  { type: 'number' },
          }
        }
      }
    }
  }
}

module.exports = { thresholdArrayValidator }
