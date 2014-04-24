var Sublevel = require('level-sublevel')
  , EE = require('events').EventEmitter
  , concat = require('concat-stream')
  , resumer = require('resumer')

module.exports = setup

function setup(db) {
  db = Sublevel(db)

  var user_db = db.sublevel('users', {valueEncoding: 'json'})
    , meta_db = db.sublevel('meta', {valueEncoding: 'json'})
    , etc_db = db.sublevel('etc', {valueEncoding: 'json'})
    , tgz_db = db.sublevel('tgz')

  var backend = new EE

  backend.getTarball = get_tarball
  backend.setTarball = set_tarball
  backend.removeTarball = remove_tarball

  backend.get = get.bind(null, etc_db)
  backend.set = set.bind(etc_db, 'set')
  backend.remove = remove.bind(etc_db, 'remove')
  backend.createStream = etc_db.createReadStream.bind(etc_db)

  backend.getUser = get.bind(null, user_db)
  backend.setUser = set.bind(user_db, 'setUser')
  backend.removeUser = remove.bind(user_db, 'removeUser')
  backend.createUserStream = user_db.createReadStream.bind(user_db)

  backend.getMeta = get.bind(null, meta_db)
  backend.setMeta = set.bind(meta_db, 'setMeta')
  backend.removeMeta = remove.bind(meta_db, 'removeMeta')
  backend.createMetaStream = meta_db.createReadStream.bind(meta_db)

  return backend

  function get(db, name, done) {
    db.get(name, function(err, data) {
      if(err) {
        return done(err.notFound ? null : err, null)
      }

      done(null, data)
    })
  }

  function set(ev, name, val, done) {
    var db = this
      , old

    get(db, name, got_old)

    function got_old(err, data) {
      if(err) {
        return done(err)
      }

      old = data
      db.put(name, val, set_data)
    }

    function set_data(err) {
      if(err) {
        return done(err)
      }

      done()
      backend.emit(ev, val, old)
    }
  }

  function remove(ev, name, done) {
    var db = this
      , old

    get(db, name, got_old)

    function got_old(err, data) {
      if(err) {
        return done(err)
      }

      old = data
      db.del(name, removed)
    }

    function removed(err) {
      if(err) {
        return done(err)
      }

      done()
      backend.emit(ev, old)
    }
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

  function remove_tarball(name, version) {
    tgz_db.del(name + '@' + version + '.tgz', done)
  }
}
