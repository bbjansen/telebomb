// Copyright (c) 2021, BB Jansen
//
// Please see the included LICENSE file for more information.

'use strict'

const db = require('../../libs').knex

// Create 'scraps' table if it does not exist
db.schema.hasTable('scraps').then(function (exists) {
  if (!exists) {
    console.info('[DB] Table `scraps` created')

    return db.schema.createTable('scraps', function (table) {
      table.integer('id').unique().notNullable()
      table.string('username').nullable()
      table.integer('channel').nullable()
      table.integer('count').nullable()
      table.bigInteger('timestamp').nullable()
    })
  };
})

// Create 'users' table if it does not exist
db.schema.hasTable('users').then(function (exists) {
  if (!exists) {
    console.info('[DB] Table `users` created')

    return db.schema.createTable('users', function (table) {
      table.integer('id').unique().notNullable()
      table.string('username').nullable()
      table.string('first_name').nullable()
      table.string('last_name').nullable()
      table.bigInteger('phone').nullable()
      table.integer('api_id').nullable()
      table.string('api_hash').nullable()
      table.bigInteger('timestamp').nullable()
    })
  };
})
