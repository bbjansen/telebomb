// Copyright (c) 2021, BB Jansen
//
// Please see the included LICENSE file for more information.

'use strict'

const spawn = require('threads').spawn
const Thread = require('threads').Thread
const Worker = require('threads').Worker

const scheduler = require('node-cron')


// Setup logger
require('console-stamp')(console, {
  pattern: 'dd/mm/yyyy HH:MM:ss.l',
  colors: {
    stamp: 'green',
    label: 'white'
  }
})

// Setup DB
require('./utils/db/schema');

// Initialize
(async () => {
  try {

    const counter = await spawn(new Worker("./workers/scrape"))
    await counter.increment()
    await counter.increment()
    await counter.decrement()
    
    console.log(`Counter is now at ${await counter.getCount()}`)
    
    await Thread.terminate(counter)

  } catch (err) {
    console.error(err.toString())
  }
})()
