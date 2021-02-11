// Copyright (c) 2021, BB Jansen
//
// Please see the included LICENSE file for more information.

'use strict'

const { MTProto } = require('@mtproto/core')
const { LocalStorage } = require('node-localstorage')
const moment = require('moment')

const { availableAccounts, availableChannels, shuffleArray } = require('../libs').helpers
const { Accounts, Users, Channels, Links } = require('../models')

const accounts = new Accounts()
const users = new Users()
const channels = new Channels()
const links = new Links()

module.exports = async function () {
  try {
    // Setup counts
    let userCount = 0
    let channelCount = 0

    // Lets select all available accounts for scanning
    const getAccounts = await accounts.all()
    const selectedAccounts = await availableAccounts(getAccounts, 'scanning')

    if (!selectedAccounts) return

    // Lets now select 1 account from the filtered ones by random
    const randomize = Math.floor(Math.random() * selectedAccounts.length)
    const account = selectedAccounts[randomize]

    console.log('[ACCOUNT] ' + account.phone + ' selected')

    // Lets open a connection via the Telegram MTProto protocol.
    const telegram = new MTProto({
      api_id: account.api,
      api_hash: account.hash,
      customLocalStorage: LocalStorage('./sessions/' + account.phone)
    })

    // Fetch messages from the selected account
    const messages = await telegram.call('messages.getDialogs', {
      offset_peer: {
        _: 'inputPeerEmpty'
      },
      limit: 100
    },
    { dcId: account.dc })

    console.log('[ACCOUNT] scanning account ' + account.phone)

    // Lets store the users in these messages
    for (const user of messages.users) {
      if (!user.bot && !user.deleted) {
        const insertUser = await users.insert({
          id: user.id,
          hash: user.access_hash,
          phone: user.phone,
          username: user.username,
          invited: false,
          private: false,
          logged: moment().unix()
        })

        if (insertUser) {
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
          account: account.phone,
          channel: chat.id,
          logged: moment().unix()
        })

        if (insertLink) {
          channelCount++
        }
      }
    }

    // Time to scrape some users from scraped channels
    const getChannels = await channels.account(account.phone)
    const selectedChannels = await availableChannels(getChannels)
    if (!selectedChannels) return

    // Lets shuffle the array
    const filteredChannels = shuffleArray(selectedChannels)

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
      const getInfo = await telegram.call('channels.getParticipants', {
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
      { dcId: account.dc })

      // set total
      total = getInfo.count

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
        { dcId: account.dc })

        // insert users
        for (const user of getParticipants.users) {
          if (!user.bot && !user.deleted) {
            const insertUser = await users.insert({
              id: user.id,
              hash: user.access_hash,
              phone: user.phone,
              username: user.username,
              invited: false,
              private: false,
              logged: moment().unix()
            })

            if (insertUser) {
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

      // Record scanning time for channel
      await channels.update({ id: channel.id, scanned: moment().unix() })
    }

    // Record scanning time for account
    await accounts.update({ phone: account.phone, scanned: moment().unix() })

    console.log('[ACCOUNT] ' + userCount + ' users scraped for account ' + account.phone)
    console.log('[ACCOUNT] ' + channelCount + ' channels scraped for account ' + account.phone)
  } catch (err) {
    console.log(err)
  }
}
