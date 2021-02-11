// Copyright (c) 2021, BB Jansen
//
// Please see the included LICENSE file for more information.

'use strict'

require('dotenv').config()

const moment = require('moment')
const shortid = require('shortid')

const { generateCycle } = require('../libs').helpers

const { Invites } = require('../models')
const invites = new Invites()

const startBomb = (async () => {
  try {
    // Setup counts
    let inviteCount = 0

    // Validate input
    const input = process.argv.slice(2)
    const channel = input[1]
    const users = input[3]
    const hours = input[5]
    const batch = shortid.generate()

    if (input[0] !== '-channel' || !input[1]) {
      console.log('[ERROR] missing -channel')
      return
    }

    if (input[2] !== '-users' || !input[3]) {
      console.log('[ERROR] missing -users')
      return
    }

    if (input[4] !== '-hours' || !input[5]) {
      console.log('[ERROR] missing -hours')
      return
    }

    console.log('[BOMB] started for channel ' + channel + ' with ' + users + ' users spread over ' + hours + ' hours')

    // Generate a random release pattern and order it
    const getHourCycle = generateCycle(users, hours)

    getHourCycle.sort(function (a, b) {
      return b - a
    })

    // Loop through the hour cycle to create minute cycles
    for (const [hours, usersPerHour] of getHourCycle.entries()) {
      const getMinuteCycle = generateCycle(usersPerHour, 60)

      // insert each element in the minute cycle as an invite
      for (const [minutes, usersPerMinute] of getMinuteCycle.entries()) {
        // Calculate future invite date
        const scheduled = moment().add(hours, 'hours').add(minutes, 'minutes').unix()

        await invites.insert({
          batch: batch,
          channel: channel,
          users: usersPerMinute,
          scheduled: scheduled,
          processed: false,
          logged: moment().unix()
        })

        inviteCount += usersPerMinute
      }
    }

    console.log('[BOMB] ' + inviteCount + ' invites generated with the following cycle pattern ' + JSON.stringify(getHourCycle) + ' represented in hours')
  } catch (err) {
    console.log(err)
  }
})()
