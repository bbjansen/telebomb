// Copyright (c) 2021, BB Jansen
//
// Please see the included LICENSE file for more information.

'use strict'

const db = require('../libs').knex
const moment = require('moment')

class Accounts {
  constructor (opts) {
    opts = opts || {}
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
