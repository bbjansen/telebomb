// Copyright (c) 2021, BB Jansen
//
// Please see the included LICENSE file for more information.

'use strict'

const db = require('../libs').knex

class Links {
  constructor (opts) {
    opts = opts || {}
  }

  async insert (link) {
    try {
      const findLink = await db('links').select().where('account', link.account).where('channel', link.channel)

      if (findLink.length === 0) {
        const insertLink = await db('links').insert(link)

        if (process.env.DEBUG) {
          console.log('[LINK] between account ' + link.account + ' and channel ' + link.channel + ' inserted')
        }

        return insertLink
      }
    } catch (err) {
      if (!err.errno === 19) {
        console.error(err)
      }
    }
  }
}

module.exports = Links
