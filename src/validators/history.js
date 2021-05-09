const historyValidator = {
  schema: {
    response: {
      '2xx': {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            time:        { type: 'string' },
            humidity:    { type: 'number' },
            temperature: { type: 'number' },
            capacity:    { type: 'number' },
            pressure:    { type: 'number' },
          }
        }
      }
    }
  }
}

module.exports = { historyValidator }
