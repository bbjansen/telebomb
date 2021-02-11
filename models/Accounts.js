// Copyright (c) 2021, BB Jansen
//
// Please see the included LICENSE file for more information.

'use strict'

const db = require('../libs').knex

class Accounts {
  constructor (opts) {
    opts = opts || {}
  }

  async update (account) {
    try {
      const updateAccount = await db('accounts').update(account).where('phone', account.phone)

      if (process.env.LOGGING) {
        console.log('[ACCOUNT] ' + account.phone + ' updated')
      }

      return updateAccount
    } catch (err) {
      console.error(err)
    }
  }

  async channel (id) {
    try {
      const getAccounts = await db('links')
        .join('accounts', 'accounts.phone', 'links.account')
        .join('channels', 'channels.id', 'links.channel')
        .select()
        .where('channels.id', id)

      if (process.env.LOGGING) {
        console.log('[ACCOUNT] ' + getAccounts.length + ' accounts belong to channel ' + id + ' selected')
      }

      return getAccounts
    } catch (err) {
      console.error(err)
    }
  }

  async all () {
    try {
      const getAccounts = await db('accounts').select()

      if (process.env.LOGGING) {
        console.log('[ACCOUNT] ' + getAccounts.length + ' accounts selected')
      }

      return getAccounts
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = Accounts
