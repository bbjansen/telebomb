// Copyright (c) 2021, BB Jansen
//
// Please see the included LICENSE file for more information.

'use strict'

require('dotenv').config()

const figlet = require('figlet')
const scheduler = require('node-cron')
const { userWorker, inviteWorker } = require('./workers')
const { Accounts, Users, Channels, Invites } = require('./models')

const accounts = new Accounts()
const users = new Users()
const channels = new Channels()
const invites = new Invites()

// Get Statistics
accounts.all()
users.all()
users.available()
channels.all()
invites.pending()

// Splash
console.info(figlet.textSync('Telebomb', {
  horizontalLayout: 'fitted',
  verticalLayout: 'fitted'
}))

// Setup logger
require('console-stamp')(console, {
  pattern: 'dd/mm/yyyy HH:MM:ss.l',
  colors: {
    stamp: 'green',
    label: 'white'
  }
})

console.info('2021 Edition')
console.info('@bbjansen')

// Setup DB
require('./utils/db/schema');

// Initialize
(async () => {
  try {

    // Lets collect users every 12 hours
    scheduler.schedule('0 */12 * * *', () => {
      userWorker()
    })

    // Scan for new invites every minute
    scheduler.schedule('* * * * *', () => {
      inviteWorker()
    })
  } catch (err) {
    console.error(err)
  }
})()
