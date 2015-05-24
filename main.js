var options = {};

var TBLStore = require('./TBLStore.js')(options)

console.time('FindOne')
TBLStore.findOne('TMP.cards.*', {name: 'Aluren'})
.then(function(card) {
  console.log(card)
  console.timeEnd('FindOne')
})
.catch(function(err) {
  console.log(err)
})
