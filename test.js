var test = require('unpm-backend-test')
  , backend = require('./index')
  , levelup = require('levelup')
  , memdown = require('memdown')

test(backend(levelup('/in/memory/', { db: memdown})))
