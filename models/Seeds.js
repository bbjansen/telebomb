// Copyright (c) 2021, BB Jansen
//
// Please see the included LICENSE file for more information.

'use strict'

const db = require('../libs').knex

class Seeds {
  constructor (opts) {
    opts = opts || {}
  }

  async add (seed) {
    try {
      return await db('seeds').insert(seed)
    } catch (err) {
      console.error(err)
    }
  }

  async remove (id) {
    try {
      return await db('seeds').delete({
        id: id
      })
    } catch (err) {
      console.error(err)
    }
  }

  async get (id) {
    try {
      return await db('seeds').select({
        id: id
      })
    } catch (err) {
      console.error(err)
    }
  }

  async all () {
    try {
      return await db('seeds').select()
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = Seeds
