// Copyright (c) 2021, BB Jansen
//
// Please see the included LICENSE file for more information.

'use strict'

const { MTProto } = require('@mtproto/core')
const { LocalStorage } = require('node-localstorage')
const moment = require('moment')

const Accounts = require('../models').Accounts
const Users = require('../models').Users
const Channels = require('../models').Channels
const Links = require('../models').Links

const accounts = new Accounts()
const users = new Users()
const channels = new Channels()
const links = new Links()

process.env.DEBUG = 1

const Scrape = (async () => {
  try {
  } catch (err) {
    console.log(err)
  }
})()
