var mongoose = require('mongoose');


var Schema = mongoose.Schema;


var ApplicantSchema = new Schema({
  firstname: {type:String, required:true},
  lastname: {type:String, required:true},
  placeDate: {type:Date},
  interviewDate: {type:Date},
  contacts:[{
    contactValue : {type:String, required:true},
    contactType: {type:String, required:true}
  }],
  skills:[{
    skillType: {type:String, required:true},
    skillValue: {type:String, required:true}
  }]
});

module.exports = mongoose.model('Applicant', ApplicantSchema);
