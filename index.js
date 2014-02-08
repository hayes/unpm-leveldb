var Sublevel = require('level-sublevel')
  , concat = require('concat-stream')
  , resumer = require('resumer')

module.exports = setup

function setup(db) {
  db = Sublevel(db)

  var module_db = db.sublevel('moduls')
    , user_db = db.sublevel('users')

  return {
      get_user: get_user
    , set_user: set_user
    , get_meta: get_meta
    , set_meta: set_meta
    , get_tarball: get_tarball
    , set_tarball: set_tarball
    , get_module_meta: get_module_meta
    , set_module_meta: set_module_meta
  }

  function get_user(name, done) {
    user_db.get(name, db_resonse(done))
  }

  function set_user(name, data, done) {
    user_db.put(name, JSON.stringify(data), done)
  }

  function get_module_meta(name, done) {
    module_db.get(name, db_resonse(done))
  }

  function set_module_meta(name, meta, done) {
    module_db.put(name, JSON.stringify(meta), done)
  }

  function get_meta(name, version, done) {
    module_db.get(name + '@' + version, db_resonse(done))
  }

  function set_meta(name, version, meta, done) {
    module_db.put(name + '@' + version, JSON.stringify(meta), done)
  }

  function get_tarball(name, version) {
    var tarball_stream = resumer()

    module_db.get(name + '@' + version + '.tgz', on_data)

    return tarball_stream

    function on_data(err, data) {
      if(err) {
        return tarball_stream.emit('error')
      }

      data = new Buffer(data, 'base64')
      tarball_stream.write(data)
      tarball_stream.end()
    }
  }

  function set_tarball(name, version) {
    return concat(on_data)

    function on_data(data) {
      module_db.put(name + '@' + version + '.tgz', data.toString('base64'))
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
