μnpm-leveldb
============

leveldb backend for [μnpm](https://www.npmjs.org/package/unpm)

[![Build Status](https://travis-ci.org/hayes/unpm-leveldb.png?branch=master)](https://travis-ci.org/hayes/unpm-leveldb)

API
---

This module exports an object with the following properties:

- `getUser(name, done)`: retrieve a user name, call a node style callback
  (`function(error, data)`) when it's been retrieved from the database.

- `setUser(name, data, done)`: set a user name, along with a
  `JSON.stringify`-able blob of your user data. This should have keys:

  ```js
  {
      name: <username>
    , email: <email>
    , salt: <salt>
    , date: <date>
    , password_hash: <hashed_password>
  }
  ```
  
  It calls a node style callback (`function(error, data)`) when it's been
  set in the database.

- `createUserStream(options)`: create a readable stream of user entries as
  key value pairs. `options` is an optional object of the form of [levelup's
  createReadStream()](https://github.com/rvagg/node-levelup#createReadStream)
  options.

- `getMeta(name, done)`: retrieve a meta data for a username, call a node
  style callback (`function(error, data)`) when it's been retrieved from the
  database.

- `setMeta(name, meta, done)`: Set meta-data for a package called `name` and
  call a node style callback (`function(error, data)`) when it's been retrieved
  from the database. `meta` is an object that looks like
  [EXAMPLE-META-DATA.json](./EXAMPLE-META-DATA.json)

- `createMetaStream(options)`: create a readable stream of meta data entries as
  key value pairs. `options` is an optional object of the form of [levelup's
  createReadStream()](https://github.com/rvagg/node-levelup#createReadStream)
  options.


- `getTarball(name, version)` -> `ReadableStream`:  Retrieve a package tarball
  from the database. This returns a byte stream of the `.tgz`.

- `setTarball(name, version)` -> `WritableStream`: Create a writable stream
  which uploads the tarball to the DB. The tarball must conform to the
  specification described by
  [npm-install](https://www.npmjs.org/doc/cli/npm-install.html)

- `get(name, done)`: retrieve value for `name` in the arbitrary key/value
  store.

- `set(name, data, done)`: save `data` keyed as `name` in the arbitrary
  key/value store.

- `createStream(option)`: create a readable stream of the entries in the
  arbitrary key/value store. `options` is an optional object of the form of
  [levelup's
  createReadStream()](https://github.com/rvagg/node-levelup#createReadStream)
  options.

