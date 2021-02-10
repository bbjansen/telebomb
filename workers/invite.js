// Copyright (c) 2021, BB Jansen
//
// Please see the included LICENSE file for more information.

'use strict'

const { MTProto } = require('@mtproto/core')
const { LocalStorage } = require('node-localstorage')
const moment = require('moment')

const helpers = require('../libs').helpers

const Accounts = require('../models').Accounts
const Users = require('../models').Users
const Channels = require('../models').Channels
const Links = require('../models').Links

const accounts = new Accounts()
const users = new Users()
const channels = new Channels()
const links = new Links()

process.env.DEBUG = 1
process.env.INVITE_ACCOUNT_INTERVAL = 0
process.env.INVITE_CHANNEL_INTERVAL = 0

const Invite = (async () => {
  try {
    // Setup counts
    let accountCount = 0
    const inviteCount = 0

    // Lets select a random account in our database
    const availableAccounts = await accounts.available(process.env.INVITE_ACCOUNT_INTERVAL)

    if (!availableAccounts) return

    // Lets loop through all the accounts

    for (const account of availableAccounts) {
      // Lets open a connection via the Telegram MTProto protocol.
      const telegram = new MTProto({
        api_id: account.api,
        api_hash: account.hash,
        customLocalStorage: LocalStorage('./sessions')
      })

      // Fetch messages from the selected account
      const messages = await telegram.call('messages.getDialogs', {
        offset_peer: {
          _: 'inputPeerEmpty'
        },
        limit: 100
      },
      { dcId: target.dc })

      accountCount++
    }
  } catch (err) {
    console.log(err)
  }
})()
