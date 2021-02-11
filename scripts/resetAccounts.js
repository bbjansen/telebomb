// Copyright (c) 2021, BB Jansen
//
// Please see the included LICENSE file for more information.

'use strict'

require('dotenv').config()

const { Accounts } = require('../models')
const accounts = new Accounts()

const resetAccounts = (async () => {
  try {
    // Setup counts
    let resetCount = 0

    // Validate input
    const input = process.argv.slice(2)
    const reset = input[1]

    if (input[0] !== '--reset' || reset) {
      console.log('[ERROR] missing --reset')
      return
    }

    if (input[1] === 'all') {
      const getAccounts = await accounts.all()

      for (const account of getAccounts) {
        await accounts.update({
          phone: account.phone,
          scanned: 0,
          invited: 0
        })

        console.log('[RESET] account ' + account.phone + ' resetted')

        resetCount++
      }
    } else {
      console.log('[ERROR] unknown input.')
    }

    console.log('[RESET] ' + resetCount + ' accounts resetted')
  } catch (err) {
    console.log(err)
  }
})()
