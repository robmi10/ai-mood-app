// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'mike',
      password: '12345678mike',
      database: 'moodly',
      port: 6500
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    }
  },
};
