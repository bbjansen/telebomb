// Copyright (c) 2021, BB Jansen
//
// Please see the included LICENSE file for more information.

'use strict'

const db = require('../libs').knex
const moment = require('moment')

class Invites {
  constructor (opts) {
    opts = opts || {}
  }

  async insert (invite) {
    try {
      const insertInvite = await db('invites').insert(invite)

      const scheduled = moment(invite.scheduled, 'X')

      if (process.env.LOGGING) {
        console.log('[INVITE] ' + invite.users + ' users scheduled in ' + scheduled.hours() + ' hour(s) and ' + scheduled.minutes() + ' minute(s) for batch #' + invite.batch)
      }

      return insertInvite
    } catch (err) {
      if (!err.errno === 19) {
        console.error(err)
      }
    }
  }

  async update (invite) {
    try {
      const updateInvite = await db('invites').update(invite).where('id', invite.id)

      if (process.env.LOGGING) {
        console.log('[INVITE] #' + invite.id + ' updated')
      }

      return updateInvite
    } catch (err) {
      console.error(err)
    }
  }

  async all () {
    try {
      const getInvites = await db('invites').select()

      if (process.env.LOGGING) {
        console.log('[INVITE] ' + getInvites.length + ' tasks selected')
      }

      return getInvites
    } catch (err) {
      console.error(err)
    }
  }

  async pending () {
    try {
      const getPendingInvites = await db('invites').select()
        .where('processed', false)
        .where('scheduled', '<', moment().unix())
        .orderBy('scheduled', 'asc')

      if (process.env.LOGGING) {
        console.log('[INVITE] ' + getPendingInvites.length + ' pending invites selected')
      }

      return getPendingInvites
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = Invites
