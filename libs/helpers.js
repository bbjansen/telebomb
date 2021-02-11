// Copyright (c) 2021, BB Jansen
//
// Please see the included LICENSE file for more information.

'use strict'

const moment = require('moment')

function availableAccounts (accounts, type) {
  const filterAccounts = accounts.filter(account => {
    let difference
    let interval
    if (type === 'scanning') {
      difference = moment().diff(moment(account.scanned, 'X'), 'hours')
      interval = process.env.COLLECT_ACCOUNT_INTERVAL
    } else if (type === 'inviting') {
      difference = moment().diff(moment(account.invited, 'X'), 'hours')
      interval = process.env.INVITE_ACCOUNT_INTERVAL
    }

    if (difference >= interval) return account
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

    if (difference >= process.env.COLLECT_CHANNEL_INTERVAL) return channel
  })

  if (filteredChannels.length === 0) {
    console.log('[CHANNEL] no channels available for scanning right now.')
  } else {
    console.log('[CHANNEL] ' + filteredChannels.length + '/' + channels.length + ' channels available')
  }

  return filteredChannels
}

function shuffleArray (set) {
  for (let i = set.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = set[i]

    set[i] = set[j]
    set[j] = temp
  }

  return set
}

function generateCycle (max, thecount) {
  const r = []
  const decimals = []
  let currsum = 0
  for (let i = 0; i < thecount; i++) {
    r.push(Math.random())
    currsum += r[i]
  }

  let remaining = max
  for (let i = 0; i < r.length; i++) {
    const res = r[i] / currsum * max
    r[i] = Math.floor(res)
    remaining -= r[i]
    decimals.push(res - r[i])
  }

  while (remaining > 0) {
    let maxPos = 0
    let maxVal = 0

    for (let i = 0; i < decimals.length; i++) {
      if (maxVal < decimals[i]) {
        maxVal = decimals[i]
        maxPos = i
      }
    }

    r[maxPos]++
    decimals[maxPos] = 0 // We set it to 0 so we don't give this position another one.
    remaining--
  }

  return r
}

module.exports = { availableAccounts, availableChannels, shuffleArray, generateCycle }
