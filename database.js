require('dotenv').config();

const knex = require('knex')({
    client: 'mysql2',
    connection: {
      host: process.env.DBHOST,
      user: process.env.DBUSER,
      password: process.env.DBPASS,
      database: process.env.DB
    }
  });
  
  module.exports=knex;