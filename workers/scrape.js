// Copyright (c) 2021, BB Jansen
//
// Please see the included LICENSE file for more information.

'use strict'

const db = require('../libs').knex

const Accounts = require('../models').Accounts
const accounts = new Accounts()

const { MTProto } = require('@mtproto/core')
const { LocalStorage } = require('node-localstorage')

const fs = require('fs');


const Scrape = (async () => {
  try {
    // Lets select a random account in our database
    const allAccounts = await accounts.all()

    const randomize = Math.floor(Math.random() * allAccounts.length)
    const target = allAccounts[randomize]

    console.log(target.phone + ' selected for harvesting.')

    // Lets open a connection via the Telegram MTProto protocol.
    const telegram = new MTProto({
      api_id: target.api,
      api_hash: target.hash,
      customLocalStorage: LocalStorage('./sessions')
    })

    const dialogs = await telegram.call('messages.getDialogs', {
      offset_peer: {
        _: 'inputPeerEmpty'
      },
      limit: 100
    },
    { dcId: target.dc });

    console.log(dialogs)

    fs.writeFile('helloworld.json', JSON.stringify(dialogs), function (err) {
      if (err) return console.log(err);
    });

  } catch (err) {
    console.error(err)
  }
})()
