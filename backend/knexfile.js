const env = require('./.env')

module.exports = {
  
    client: 'postgresql',
    connection: env.db,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }

};
