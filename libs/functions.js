// Copyright (c) 2021, BB Jansen
//
// Please see the included LICENSE file for more information.

'use strict'

const moment = require('moment')

const Accounts = require('../models').Accounts
const accounts = new Accounts()

async function pickAccount() {
    // Lets select a random account in our database
    const getAccounts = await accounts.all()

    // Lets filter out recently scanned accounts
    const filterAccounts = getAccounts.filter(account => {
      const difference = moment().diff(moment(account.scanned, 'X'), 'hours')

      if (difference >= process.env.ACCOUNT_TIMEOUT) {
        return account
      }
    })

    if (filterAccounts.length === 0) {
      console.log('[ACCOUNT] no accounts available for scanning right now.')
      return
    } else {
      console.log('[ACCOUNT] ' + filterAccounts.length + '/' + getAccounts.length + ' accounts available')
    }

    // Lets now select 1 account from the filtered ones by random
    const randomize = Math.floor(Math.random() * filterAccounts.length)
    const target = filterAccounts[randomize]

    console.log('[ACCOUNT] ' + target.phone + ' selected')

    return target
}

module.exports = { pickAccount }