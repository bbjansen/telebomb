// Copyright (c) 2021, BB Jansen
//
// Please see the included LICENSE file for more information.

'use strict'

const { MTProto } = require('@mtproto/core')
const { LocalStorage } = require('node-localstorage')
const moment = require('moment')

const { availableAccounts, shuffleArray } = require('../libs').helpers
const { Accounts, Invites, Users } = require('../models')

const accounts = new Accounts()
const invites = new Invites()
const users = new Users()

module.exports = async function () {
  try {
    // Setup counts
    let inviteCount = 0

    // Lets fetch pending tickets that have to be processed
    const getPendingInvites = await invites.pending()

    if (getPendingInvites.length === 0) {
      console.log('[INVITES] no pending invites available right now.')
      return
    } else {
      console.log('[INVITES] ' + getPendingInvites.length + ' invites pending')
    }

    // Lets loop through the pending invites
    for (const inviteBatch of getPendingInvites) {
      // If batch has zero users, stop and record as processed
      if (inviteBatch.users === 0) {
        await invites.update({ id: inviteBatch.id, processed: true })
        return
      }

      // Lets select all available accounts that have access to this channel
      const getChannelAccounts = await accounts.channel(inviteBatch.channel)
      const selectedAccounts = await availableAccounts(getChannelAccounts, 'inviting')

      if (!selectedAccounts) return

      // Lets now select 1 account from the filtered ones by random
      const randomize = Math.floor(Math.random() * selectedAccounts.length)
      const account = selectedAccounts[randomize]

      console.log('[ACCOUNT] ' + account.phone + ' selected')

      // Lets open a connection via the Telegram MTProto protocol.
      const telegram = new MTProto({
        api_id: account.api,
        api_hash: account.hash,
        customLocalStorage: LocalStorage('./sessions')
      })

      // Lets grab available users that we can send an invite to
      const availableUsers = await users.available()

      if (availableUsers.length === 0) {
        console.log('[USER] no users available for invitation right now.')
        return
      } else {
        console.log('[USER] ' + availableUsers.length + ' users available')
      }

      // Shuffle users to create randomness
      const shuffledUsers = shuffleArray(availableUsers)

      // Take the amount of users as defined in the invite batch
      const selectedUsers = shuffledUsers.slice(0, +inviteBatch.users)

      // Fetch user information to send invite
      for (const user of selectedUsers) {
        try {
          await telegram.call('channels.inviteToChannel', {
            channel: {
              _: 'inputChannel',
              channel_id: account.id,
              access_hash: account.hash
            },
            users: [{
              _: 'inputUser',
              user_id: user.id,
              access_hash: user.hash
            }]
          },
          { dcId: account.dc })

          await users.update({
            id: user.id,
            invited: true
          })

          console.log('[INVITE] #' + inviteBatch.id + ' send to user ' + user.id + ' from batch ' + inviteBatch.batch)

          inviteCount += inviteBatch.users
        } catch (err) {
          await users.update({
            id: user.id,
            private: true
          })
        }
      }

      console.log('[INVITE] ' + inviteCount + ' invites send from batch ' + inviteBatch.batch)

      // Record batch invite as procssed
      await invites.update({ id: inviteBatch.id, processed: true })

      // Record invited time for account
      await accounts.update({ phone: account.phone, invited: moment().unix() })
    }
  } catch (err) {
    console.log(err)
  }
}
