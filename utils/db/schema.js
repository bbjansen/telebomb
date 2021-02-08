// Copyright (c) 2021, BB Jansen
//
// Please see the included LICENSE file for more information.

'use strict'

const db = require('../../libs').knex

// Create 'scraps' table if it does not exist
db.schema.hasTable('users').then(function (exists) {
  if (!exists) {
    console.info('[DB] Table `users` created')

    return db.schema.createTable('users', function (table) {
      table.integer('id').unique().notNullable()
      table.string('username').nullable()
      table.integer('channel').nullable()
      table.integer('count').nullable()
      table.bigInteger('logged').nullable()
    })
  };
})

// Create 'seeds' table if it does not exist
db.schema.hasTable('seeds').then(function (exists) {
  if (!exists) {
    console.info('[DB] Table `seeds` created')

    return db.schema.createTable('seeds', function (table) {
      table.integer('id').unique().notNullable()
      table.string('phone').nullable()
      table.integer('api').nullable()
      table.string('hash').nullable()
      table.bigInteger('scanned').nullable()
      table.boolean('update').nullable()
    })
  };
})
