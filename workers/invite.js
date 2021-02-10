// Copyright (c) 2021, BB Jansen
//
// Please see the included LICENSE file for more information.

'use strict'

const { MTProto } = require('@mtproto/core')
const { LocalStorage } = require('node-localstorage')
const moment = require('moment')

const functions = require('../libs').functions

const Accounts = require('../models').Accounts
const Users = require('../models').Users
const Channels = require('../models').Channels
const Links = require('../models').Links

const accounts = new Accounts()
const users = new Users()
const channels = new Channels()
const links = new Links()

process.env.DEBUG = 1
process.env.ACCOUNT_TIMEOUT = 0
process.env.CHANNEL_TIMEOUT = 0

const Invite = (async () => {
  try {
    // Setup counts
    let userCount = 0
    let channelCount = 0

    // Lets select a random account in our database
    const target = await functions.pickAccount()

    // Lets open a connection via the Telegram MTProto protocol.
    const telegram = new MTProto({
      api_id: target.api,
      api_hash: target.hash,
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


  } catch (err) {
    console.log(err)
  }
})()
