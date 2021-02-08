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

    const string = "1BJWap1sBuyLemBYSgp18e_Y6GL9ovZc9pMz5VRiygc_H7__7_SJz5AMwEdecpQWrdi7P-r-Hf1ff5j3g8lGWEFVlVHPGKLueGUPNmbWSrETcXVl9L15dqFgKsq6rfQ5ijiZeoPX_FLYmCsayClCSZNR1BT4OfUPwvzZcj_fjQJjhyF4iS_pudLo7ZCmOuyKQq1WfweE4eOPI_LAakWmyy3mnspdEgKDXr5is4dXdrR4YbWw8qZZjGe14NFQW6me-on98jAE6xdEsEg01P8lqwPk0kIuLZUYRVnzH_Rn4XQpTg_yEAyNr7PgyhLQ03x5kX3aqneuqsvJJE7lEzd3i7COvI9SzJ8Q="
    

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
