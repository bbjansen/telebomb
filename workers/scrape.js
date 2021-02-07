// Copyright (c) 2021, BB Jansen
//
// Please see the included LICENSE file for more information.

'use strict'

const db = require('../libs').knex
const expose = require('threads').expose

let currentCount = 0

const counter = {
  getCount() {
    return currentCount
  },
  increment() {
    return ++currentCount
  },
  decrement() {
    return --currentCount
  }
}

expose(counter)