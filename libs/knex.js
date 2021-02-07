// Copyright (c) 2021, BB Jansen
//
// Please see the included LICENSE file for more information.

'use strict'

const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './db.sqlite'
  },
  useNullAsDefault: true,
  pool: {
    min: 1,
    max: 1,
    propagateCreateError: false
  }
  // debug: true,
  // timezone: 'UTC'
})

module.exports = knex
