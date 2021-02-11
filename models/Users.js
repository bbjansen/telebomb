// Copyright (c) 2021, BB Jansen
//
// Please see the included LICENSE file for more information.

'use strict'

const db = require('../libs').knex

class Users {
  constructor (opts) {
    opts = opts || {}
  }

  async insert (user) {
    try {
      const insertUser = await db('users').insert(user)

      if (process.env.LOGGING) {
        console.log('[USER] ' + user.id + ' inserted')
      }

      return insertUser
    } catch (err) {
      if (!err.errno === 19) {
        console.error(err)
      }
    }
  }

  async update (user) {
    try {
      const updateUser = await db('users').update(user).where('id', user.id)

      if (process.env.LOGGING) {
        console.log('[USER] ' + user.id + ' updated')
      }

      return updateUser
    } catch (err) {
      console.error(err)
    }
  }

  async all () {
    try {
      const getUsers = await db('users').select()

      if (process.env.LOGGING) {
        console.log('[USER] ' + getUsers.length + ' users selected')
      }

      return getUsers
    } catch (err) {
      console.error(err)
    }
  }

  async available () {
    try {
      const getUsers = await db('users').select().where('invited', false).where('private', false)

      if (process.env.LOGGING) {
        console.log('[USER] ' + getUsers.length + ' available users selected')
      }

      return getUsers
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = Users
