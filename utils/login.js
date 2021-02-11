// Copyright (c) 2021, BB Jansen
//
// Please see the included LICENSE file for more information.

'use strict'

const { MTProto } = require('@mtproto/core')
const { LocalStorage } = require('node-localstorage')

/**
 *
 *
 *
 *
 *          TO DO
 *
 *          LOGIN SCRIPT TO ACTIVATE NEW ACCOUNTS
 *
 *
 *
 */

const Scrape = (async () => {
  try {
    // Lets open a connection via the Telegram MTProto protocol.

    const mtproto = new MTProto({
      api_id: target.api,
      api_hash: target.hash,
      customLocalStorage: LocalStorage('./sessions')
    })

    const code = await mtproto.call('auth.sendCode', {
      phone_number: target.phone,
      settings: {
        _: 'codeSettings'
      }
    },
    { dcId: 4 })

    console.log(code.phone_code_hash)

    const signin = await mtproto.call('auth.signIn', {
      phone_code: 46345,
      phone_number: target.phone,
      phone_code_hash: code.phone_code_hash
    },
    { dcId: 4, syncAuth: true })
  } catch (err) {
    console.error(err)
  }
})()
