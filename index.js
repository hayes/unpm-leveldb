var Sublevel = require('level-sublevel')
  , concat = require('concat-stream')
  , resumer = require('resumer')

module.exports = setup

function setup(db) {
  db = Sublevel(db)

  var module_db = db.sublevel('moduls')
    , user_db = db.sublevel('users')
    , etc_db = db.sublevel('etc')

  return {
      get: get
    , set: set
    , getUser: get_user
    , setUser: set_user
    , getMeta: get_meta
    , setMeta: set_meta
    , getTarball: get_tarball
    , setTarball: set_tarball
    . createStream: etc_db.createReadStream.bind(etc_db)
    , createUserStream: user_db.createReadStream.bind(user_db)
    , createMetaStream: user_db.createReadStream.bind(module_db)
  }

  function get(name, done) {
    etc_db.get(name, db_resonse(done))
  }

  function set(name, data, done) {
    etc_db.put(name, JSON.stringify(data), done)
  }

  function get_user(name, done) {
    user_db.get(name, db_resonse(done))
  }

  function set_user(name, data, done) {
    user_db.put(name, JSON.stringify(data), done)
  }

  function get_meta(name, done) {
    module_db.get(name, db_resonse(done))
  }

  function set_meta(name, meta, done) {
    module_db.put(name, JSON.stringify(meta), done)
  }

  function get_tarball(name, version) {
    var tarball_stream = resumer()

    module_db.get(name + '@' + version + '.tgz', on_data)

    return tarball_stream

    function on_data(err, data) {
      if(err) {
        return tarball_stream.emit('error')
      }

      tarball_stream.write(data)
      tarball_stream.end()
    }
  }

  function set_tarball(name, version) {
    var stream = concat(on_data)

    return stream

    function on_data(data) {
      module_db.put(name + '@' + version + '.tgz', data, function(err) {
        if(err) {
          return stream.emit('error', err)
        }

        stream.emit('end')
      })
    }
  }
}

function db_resonse(done) {
  return function(err, data) {
    try {
      done(err, data ? JSON.parse(data) : [])
    } catch(err) {
      done(err)
    }
  }
}
