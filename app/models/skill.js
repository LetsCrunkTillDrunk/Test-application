var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SkillSchema = new Schema({
  skillType:{type:String, required:true},
});

module.exports = mongoose.model('Skill', SkillSchema);
