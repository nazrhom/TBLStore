var fs = require('fs')
var JSONStream = require('JSONStream')
var _ = require('lodash')
var crypto = require('crypto')
var Promise = require('bluebird')

function matches(src, partial) {
  var match = true
  _.forOwn(partial, function(value, key) {
    if (_.isUndefined(src[key]) || !_.isEqual(src[key], value)) {
      match = false
      return false
    }
  })
  return match
}

var TBLStore = function(options) {
  if (!(this instanceof TBLStore)) {
    return new TBLStore(options)
  }

  options = options || {}

  this.algorithm = options.algorithm || 'aes-256-cbc'
  this.password = options.password || '1234'
  this.source = options.source || 'out.enc'

  this.decrypt = crypto.createDecipher(this.algorithm, this.password)
}

TBLStore.prototype.findOne = function (path, partial) {
  var self = this
  return new Promise(function(resolve, reject) {
    var parse = JSONStream.parse(path)
    var encstream = fs.createReadStream(self.source)

    encstream
      .pipe(self.decrypt)
      .pipe(parse)
      .on('data', function(data) {
        if (matches(data, partial)) {
          encstream.unpipe(self.decrypt)
          return resolve(data)
        }
      })
      .on('end', function() {
        return resolve('Ooops not found!')
      })
      .on('error', reject)
  })
}


module.exports = TBLStore
