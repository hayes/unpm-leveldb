var Sublevel = require('level-sublevel')
  , concat = require('concat-stream')
  , resumer = require('resumer')

module.exports = setup

function setup(db) {
  db = Sublevel(db)

  var module_db = db.sublevel('moduls', {valueEncoding : 'json'})
    , user_db = db.sublevel('users', {valueEncoding : 'json'})
    , etc_db = db.sublevel('etc', {valueEncoding : 'json'})
    , tgz_db = db.sublevel('tgz')

  return {
      get: etc_db.get.bind(etc_db)
    , set: etc_db.put.bind(etc_db)
    , getUser: user_db.get.bind(user_db)
    , setUser: user_db.put.bind(user_db)
    , getMeta: module_db.get.bind(module_db)
    , setMeta: module_db.put.bind(module_db)
    , getTarball: get_tarball
    , setTarball: set_tarball
    . createStream: etc_db.createReadStream.bind(etc_db)
    , createUserStream: user_db.createReadStream.bind(user_db)
    , createMetaStream: meta_db.createReadStream.bind(module_db)
  }

  function get_tarball(name, version) {
    var tarball_stream = resumer()

    tgz_db.get(name + '@' + version + '.tgz', on_data)

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
      tgz_db.put(name + '@' + version + '.tgz', data, function(err) {
        if(err) {
          return stream.emit('error', err)
        }

        stream.emit('end')
      })
    }
  }
}
