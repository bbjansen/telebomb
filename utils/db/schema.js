// Copyright (c) 2021, BB Jansen
//
// Please see the included LICENSE file for more information.

'use strict'

const db = require('../../libs').knex

// Create 'accounts' table if it does not exist
db.schema.hasTable('accounts').then(function (exists) {
  if (!exists) {
    console.info('[DB] Table `accounts` created')

    return db.schema.createTable('accounts', function (table) {
      table.string('phone').unique().nullable()
      table.integer('dc').nullable()
      table.integer('api').nullable()
      table.string('hash').nullable()
      table.bigInteger('scanned').nullable()
    })
  };
})

// Create 'users' table if it does not exist
db.schema.hasTable('users').then(function (exists) {
  if (!exists) {
    console.info('[DB] Table `users` created')

    return db.schema.createTable('users', function (table) {
      table.integer('id').unique().nullable()
      table.string('hash').nullable()
      table.string('phone').nullable()
      table.string('username').nullable()
      table.boolean('invited').nullable()
      table.bigInteger('logged').nullable()
    })
  };
})

// Create 'channels' table if it does not exist
db.schema.hasTable('channels').then(function (exists) {
  if (!exists) {
    console.info('[DB] Table `channels` created')

    return db.schema.createTable('channels', function (table) {
      table.integer('id').unique().notNullable()
      table.string('hash').nullable()
      table.string('username').nullable()
      table.string('title').nullable()
      table.bigInteger('scanned').nullable()
      table.bigInteger('logged').nullable()
    })
  };
})

// Create 'links' table if it does not exist
db.schema.hasTable('links').then(function (exists) {
  if (!exists) {
    console.info('[DB] Table `links` created')

    return db.schema.createTable('links', function (table) {
      table.string('account').nullable()
      table.integer('channel').nullable()
      table.bigInteger('logged').nullable()
    })
  };
})
