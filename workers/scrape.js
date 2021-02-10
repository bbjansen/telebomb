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
process.env.SCRAPE_ACCOUNT_INTERVAL = 1
process.env.SCRAPE_CHANNEL_INTERVAL = 0

const Scrape = (async () => {
  try {
    // Setup counts
    let userCount = 0
    let channelCount = 0

    // Lets select a random account in our database
    const availableAccounts = await functions.availableAccounts()

    // Lets now select 1 account from the filtered ones by random
    const randomize = Math.floor(Math.random() * availableAccounts.length)
    const target = availableAccounts[randomize]

    console.log('[ACCOUNT] ' + target.phone + ' selected')

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

    console.log('[ACCOUNT] scanning account ' + target.phone)

    // Lets store the users in these messages
    for (const user of messages.users) {
      if (!user.bot && !user.deleted) {

        const insertUser = await users.insert({
          id: user.id,
          hash: user.access_hash,
          phone: user.phone,
          username: user.username,
          invited: false,
          logged: moment().unix()
        })
        
        if(insertUser) {
          userCount++
        }
      }
    }

    // Lets store the channels in these messages
    for (const chat of messages.chats) {
      if (chat._ === 'channel' && !chat.restricted && chat.access_hash && chat.megagroup) {

        await channels.insert({
          id: chat.id,
          hash: chat.access_hash,
          username: chat.username,
          title: chat.title,
          scanned: moment().unix(),
          logged: moment().unix()
        })

        const insertLink = await links.insert({
          account: target.phone,
          channel: chat.id,
          logged: moment().unix()
        })

        if(insertLink) {
          channelCount++
        }
      }
    }

    // Time to scrape some users from scraped channels
    const getChannels = await channels.account(target.phone)

    // Lets filter out recently scanned channels
    const filteredChannels = getChannels.filter(channel => {
      const difference = moment().diff(moment(channel.scanned, 'X'), 'hours')

      if (difference >= process.env.SCRAPE_CHANNEL_INTERVAL) {
        return channel
      }
    })

    if (filteredChannels.length === 0) {
      console.log('[CHANNEL] no channels available for scanning right now.')
      return
    } else {
      console.log('[CHANNEL] ' + filteredChannels.length + '/' + getChannels.length + ' channels available')
    }

    // Lets shuffle the array
    for (let i = filteredChannels.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i)
      const temp = filteredChannels[i]

      filteredChannels[i] = filteredChannels[j]
      filteredChannels[j] = temp
    }

    // Let's look for users in the channels
    for (const channel of filteredChannels) {
      console.log('[CHANNEL] scanning channel ' + channel.id)

      // prepare second loop
      let offset = 0
      const limit = 100
      let total = 0
      let count = 0
      let looping = true

      // fetch users
      const getParticipants = await telegram.call('channels.getParticipants', {
        channel: {
          _: 'inputChannel',
          channel_id: channel.id,
          access_hash: channel.hash
        },
        filter: {
          _: 'channelParticipantsRecent'
        },
        offset: offset,
        limit: limit
      },
      { dcId: target.dc })

      // set total
      total = getParticipants.count

      // loop through the participants using offsets
      while (looping) {
        console.log('[CHANNEL] scanning ' + offset + '/' + total + ' users')

        // fetch users
        const getParticipants = await telegram.call('channels.getParticipants', {
          channel: {
            _: 'inputChannel',
            channel_id: channel.id,
            access_hash: channel.hash
          },
          filter: {
            _: 'channelParticipantsRecent'
          },
          offset: offset,
          limit: 100
        },
        { dcId: target.dc })

        // insert users
        for (const user of getParticipants.users) {
          if (!user.bot && !user.deleted) {
            
            const insertUser= await users.insert({
              id: user.id,
              hash: user.access_hash,
              phone: user.phone,
              username: user.username,
              invited: false,
              logged: moment().unix()
            })

            if(insertUser) {
              userCount++
            }
          }
        }

        offset += limit
        count++

        if (count++ >= (total / (limit / 2))) {
          looping = false
        }
      }

      // Record scanning time for account
      await channels.update({ id: channel.id, scanned: moment().unix() })
    }

    // Record scanning time for account
    await accounts.update({ phone: target.phone, scanned: moment().unix() })

    console.log('[ACCOUNT] ' + userCount + ' users scraped for account ' + target.phone)
    console.log('[ACCOUNT] ' + channelCount + ' channels scraped for account ' + target.phone)
  } catch (err) {
    console.log(err)
  }
})()
