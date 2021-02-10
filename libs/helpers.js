// Copyright (c) 2021, BB Jansen
//
// Please see the included LICENSE file for more information.

'use strict'

const moment = require('moment')

function availableAccounts (accounts) {
  const filterAccounts = accounts.filter(account => {
    const difference = moment().diff(moment(account.scanned, 'X'), 'hours')

    if (difference >= process.env.SCRAPE_ACCOUNT_INTERVAL) return account
  })

  if (filterAccounts.length === 0) {
    console.log('[ACCOUNT] no accounts available for scanning right now.')
    return
  } else {
    console.log('[ACCOUNT] ' + filterAccounts.length + '/' + accounts.length + ' accounts available')
  }

  return filterAccounts
}

function availableChannels (channels) {
  const filteredChannels = channels.filter(channel => {
    const difference = moment().diff(moment(channel.scanned, 'X'), 'hours')

    if (difference >= process.env.SCRAPE_CHANNEL_INTERVAL) return channel
  })

  if (filteredChannels.length === 0) {
    console.log('[CHANNEL] no channels available for scanning right now.')
  } else {
    console.log('[CHANNEL] ' + filteredChannels.length + '/' + channels.length + ' channels available')
  }
  
  return filteredChannels
}

function shuffleArray(set) {
  for (let i = set.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = set[i]

    set[i] = set[j]
    set[j] = temp
  }

  return set
}


module.exports = { availableAccounts, availableChannels, shuffleArray }
