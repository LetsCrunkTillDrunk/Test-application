var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContactSchema = new Schema({
  contactType:{type:String, required:true},
});

module.exports = mongoose.model('Contact', ContactSchema);
