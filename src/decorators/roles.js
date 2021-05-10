const getPermissions = (req) => req.headers['x-auth-permissions'] ?? ''
const canRead   = (req) => getPermissions(req).includes('read')
const canCreate = (req) => getPermissions(req).includes('create')
const canUpdate = (req) => getPermissions(req).includes('update')

module.exports = { canRead, canCreate, canUpdate }