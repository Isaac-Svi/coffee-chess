const knex = require('knex')

const db = knex({
    client: 'pg',
    version: '7.2',
    connection: {
        host: '127.0.0.1', // this is just localhost
        port: 5432, // default is 5432
        user: 'postgres',
        password: process.env.DB_PWD,
        database: 'hackathon',
    },
})

module.exports = db
