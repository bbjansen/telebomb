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

  async update (link) {
    try {
      const updateLink = await db('links').update(link).where('account', link.account).where('channel', link.channel)

      if (process.env.DEBUG) {
        console.log('[LINK] between account ' + link.account + ' and channel ' + link.channel + ' updated')
      }

      return updateLink
    } catch (err) {
      console.error(err)
    }
  }

  async delete (link) {
    try {
      const deleteLink = await db('links').delete().where('account', link.account).where('channel', link.channel)

      if (process.env.DEBUG) {
        console.log('[LINK] between account ' + link.account + ' and channel ' + link.channel + ' deleted')
      }

      return deleteLink
    } catch (err) {
      console.error(err)
    }
  }

  async fetch (link) {
    try {
      const getLink = await db('links').select().where('account', link.account).where('channel', link.channel)

      if (process.env.DEBUG) {
        console.log('[LINK] between account ' + link.account + ' and channel ' + link.channel + ' fetched')
      }

      return getLink
    } catch (err) {
      console.error(err)
    }
  }

  async all () {
    try {
      const getLinks = await db('links').select()

      if (process.env.DEBUG) {
        console.log('[LINK] ' + getLinks.length + ' links fetched')
      }

      return getLinks
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = Links
