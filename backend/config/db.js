const config = require('../knexfile.js')
const knex = require('knex')(config)

//knex.migrate.latest([config]) funciona mas nao é muito correto

module.exports = knex