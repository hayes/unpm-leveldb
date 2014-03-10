μnpm-leveldb
============

leveldb backend for [μnpm](https://www.npmjs.org/package/unpm)

API
---

This module exports an object with the following properties:

- `get_user(name, done)`: retrieve a user name, call a node style callback
  (`function(error, data)`) when it's been retrieved from the database.

- `set_user(name, data, done)`: set a user name, along with a
  `JSON.stringify`-able blob of your user data. This should have keys:

  ```js
  var user = {}

  user.name = <username>
  user.email = <email>
  user.salt = <salt>
  user.date = <date>
  user.password_hash = <hashed_password>
  ```
  
  It calls a node style callback (`function(error, data)`) when it's been
  set in the database.

- `get_meta(name, done)`: retrieve a meta data for a username, call a node
  style callback (`function(error, data)`) when it's been retrieved from the
  database.

- `set_meta(name, meta, done)`: Set meta-data for a package called `name` and
  call a node style callback (`function(error, data)`) when it's been retrieved
  from the database. `meta` is an object that looks like the [following
  gist](https://gist.github.com/mghayes/9459409)

- `get_tarball(name, version)` -> `ReadableStream`:  Retrieve a package tarball
  from the database. This returns a byte  stream of the `.tgz`.

- `set_tarball(name, version)` -> `WritableStream`: Create a writable stream
  which uploads the tarball to the DB. The tarball must conform to the
  specification described by
  [npm-install](https://www.npmjs.org/doc/cli/npm-install.html)



