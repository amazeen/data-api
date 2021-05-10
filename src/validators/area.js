const areaValidator = {
  schema: {
    response: {
      '2xx': {
        type: 'object',
        properties: {
          id: {type: 'string'},
          silos: {
            type: 'array',
            items: {type: 'string'}
          }
        }
      }
    }
  }
}

module.exports = { areaValidator }
