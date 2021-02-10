// Copyright (c) 2021, BB Jansen
//
// Please see the included LICENSE file for more information.

'use strict'

const db = require('../libs').knex

class Channels {
  constructor (opts) {
    opts = opts || {}
  }

  async insert (channel) {
    try {
      const insertChannel = await db('channels').insert(channel)

      if (process.env.DEBUG) {
        console.log('[CHANNEL] ' + channel.id + ' inserted')
      }

      return insertChannel
    } catch (err) {
      if (!err.errno === 19) {
        console.error(err)
      }
    }
  }

  async update (channel) {
    try {
      const updateChannel = await db('channels')
        .update(channel)
        .where('id', channel.id)

      if (process.env.DEBUG) {
        console.log('[CHANNEL] ' + channel.id + ' updated')
      }

      return updateChannel
    } catch (err) {
      console.error(err)
    }
  }

  async account (phone) {
    try {
      const getChannels = await db('links')
        .join('accounts', 'accounts.phone', 'links.account')
        .join('channels', 'channels.id', 'links.channel')
        .select()
        .where('accounts.phone', phone)

      if (process.env.DEBUG) {
        console.log('[CHANNEL] ' + getChannels.length + ' channels belong to account ' + phone + ' fetched')
      }

      return getChannels
    } catch (err) {
      console.error(err)
    }
  }

  async all (phone) {
    try {
      let getChannels

      if (phone) {
        getChannels = await db('channels').select().where('account_id', phone)
      } else {
        getChannels = await db('channels').select()
      }

      if (process.env.DEBUG) {
        console.log('[CHANNEL] ' + getChannels.length + ' channels fetched')
      }

      return getChannels
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = Channels
