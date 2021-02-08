// Copyright (c) 2021, BB Jansen
//
// Please see the included LICENSE file for more information.

'use strict'

const db = require('../libs').knex

const Seeds = require('../models').Seeds
const seed = new Seeds()

const { MTProto } = require('@mtproto/core')
const { LocalStorage } = require('node-localstorage')

const Scrape = (async () => {
  try {
    // Lets select a random user in our database
    const seeds = await seed.all()

    const randomize = Math.floor(Math.random() * seeds.length)
    const target = seeds[randomize]

    console.log(target.phone + ' selected for harvesting.')


    // Lets open a connection via the Telegram MTProto protocol.

    const mtproto = new MTProto({
      api_id: target.api,
      api_hash: target.hash,
      customLocalStorage: LocalStorage('./sessions')
    })



    const dialogs = await mtproto.call('messages.getDialogs', {
      offset_peer: {
        _: 'inputPeerEmpty'
      },
      limit: 100
    },
    { dcId: 4 });

    //.log(dialogs)
  } catch (err) {
    console.error(err)
  }
})()
