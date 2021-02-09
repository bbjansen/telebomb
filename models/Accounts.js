// Copyright (c) 2021, BB Jansen
//
// Please see the included LICENSE file for more information.

'use strict'

const db = require('../libs').knex

class Accounts {
  constructor (opts) {
    opts = opts || {}
  }

  async insert (account) {
    try {
      const insertAccount = await db('accounts').insert(account)

      if (process.env.DEBUG) {
        console.log('[ACCOUNT] ' + account.phone + ' inserted')
      }

      return insertAccount
    } catch (err) {
      if (!err.errno === 19) {
        console.error(err)
      }
    }
  }

  async update (account) {
    try {
      const updateAccount = await db('accounts').update(account).where('phone', account.phone)

      if (process.env.DEBUG) {
        console.log('[ACCOUNT] ' + account.phone + ' updated')
      }

      return updateAccount
    } catch (err) {
      console.error(err)
    }
  }

  async delete (phone) {
    try {
      const deleteAccount = await db('accounts').delete({ phone: phone })

      if (process.env.DEBUG) {
        console.log('[ACCOUNT] ' + phone + ' deleted')
      }

      return deleteAccount
    } catch (err) {
      console.error(err)
    }
  }

  async fetch (phone) {
    try {
      const getAccount = await db('accounts').select({ phone: phone })

      if (process.env.DEBUG) {
        console.log('[ACCOUNT] ' + phone + ' fetched')
      }

      return getAccount
    } catch (err) {
      console.error(err)
    }
  }

  async all () {
    try {
      const getAccounts = await db('accounts').select()

      if (process.env.DEBUG) {
        console.log('[ACCOUNT] ' + getAccounts.length + ' accounts fetched')
      }

      return getAccounts
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = Accounts
