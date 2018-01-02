var User = require('../models/user.js');
var Applicant = require('../models/applicant.js');
var jwt = require('jsonwebtoken');
var secret = 'secretToken';
var Contact = require('../models/contact');
var Skill = require('../models/skill');

module.exports = function(router){
    //REGISTRATION ROUTE
    router.post('/users', function(req,res){
    var user = new User();
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    if(user.username == null || user.username==""||user.password == null || user.password==""||user.email == null||user.email =="")
    {
        res.json({success: false, message:'Check that all data were provided'});
    }
    else {
        user.save(function(err){
        if(err) res.json({success:false, message:'Username or email already exists'});
        else res.json({success:true, message:'User created'});
            });
          }
        });

    //AUTHENTIFICATION ROUTE
    router.post('/auth', function(req,res){
      User.findOne({username:req.body.username}).select("username password email").exec(function(err, user){
        if(err) throw err;
        if(!user) res.json({success:false, message:'Invalid username'});
        else{
          if(req.body.password)
          {
            var isValid = user.comparePassword(req.body.password);
            if(!isValid) res.json({success:false, message:'Invalid password'});
            else {
              var token = jwt.sign({username:user.username, email:user.email}, secret, {expiresIn:'24h'});
              res.json({success:true, message:'Authentification passed', token:token});
            }
          }
          else {
            res.json({success:false, message:'Input password'});
          }
        }
      });
    });

    //ADD NEW APPLICANT ROUTE
    router.post('/applicant', function(req,res){
      var applicant = new Applicant();
      applicant.firstname = req.body.firstname;
      applicant.lastname = req.body.lastname;
      applicant.placeDate = Date();
      applicant.interviewDate = Date();
      for(var i = 0; i < req.body.conData.length; i++)
      {
        applicant.contacts.push({contactType:req.body.conData[i].type, contactValue:req.body.conData[i].value});
        var selectContact = req.body.conData[i].type;
        Contact.findOne({contactType:selectContact}, function(err, contact){
          if(err) throw err;
          if(!contact)
          {
            var contact = new Contact();
            contact.contactType = selectContact;
            contact.save(function(err){
              if(err) console.log('Could not save contact data');
            });
          }
        });
      }
      for(var i = 0; i < req.body.skillData.length; i++)
      {
        applicant.skills.push({skillType:req.body.skillData[i].type, skillValue:req.body.skillData[i].value});
        var selectSkill = req.body.skillData[i].type;
        Skill.findOne({skillType:selectSkill}, function(err, skill){
          if(err) throw err;
          if(!skill)
          {
            var skill = new Skill();
            skill.skillType = selectSkill;
            skill.save(function(err){
              if(err) console.log('Could not save skill data');
            });
          }
        });
      }
      if(applicant.firstname==null||applicant.firstname==""||applicant.lastname==null||applicant.lastname==""){
        res.json({success:false, message:'Not all data provided'});
      }
      else{
        applicant.save(function(err){
          if(err) res.json({success:false, message:'Couldnt save applicant'});
          else res.json({success:true, message:'Applicant add in database'});

        });
      }
    });
    //GET ALL APPLICANTS ROUTE
    router.get('/appls', function(req,res){
      Applicant.find({}, function(err,applicants){
        if(err) throw err;
        if(!applicants) res.json({success:false, message:'No users'});
        else {
          for (var i = 0; i< applicants.length; i++)
          {
            applicants[i].skills.sort(function(a,b){
              if(parseInt(a.skillValue) > parseInt (b.skillValue)) return -1;
              else if( parseInt(a.skillValue) < parseInt (b.skillValue)) return 1;
              else return 0;
            }).splice(3, applicants[i].skills.length);
          }

          res.json({success:true, applicants:applicants});
        }
      });
    });
    //EDIT ROUTE
    router.post('/appls', function(req, res){

       var firstname = req.body.firstname;
       var lastname = req.body.lastname;
       var contacts = [];
       var skills = [];
       for(var i = 0; i < req.body.conData.length; i++)
       {
         contacts.push({contactType:req.body.conData[i].type, contactValue:req.body.conData[i].value});
         var selectContact = req.body.conData[i].type;
         Contact.findOne({contactType:selectContact}, function(err, contact){
           if(err) throw err;
           if(!contact)
           {
             var contact = new Contact();
             contact.contactType = selectContact;
             contact.save(function(err){
               if(err) throw err;
             });
           }
         });
       }
       for(var i = 0; i < req.body.skillData.length; i++)
       {
         skills.push({skillType:req.body.skillData[i].type, skillValue:req.body.skillData[i].value});
         var selectSkill = req.body.skillData[i].type;
         Skill.findOne({skillType:selectSkill}, function(err, skill){
           if(err) throw err;
           if(!skill)
           {
             var skill = new Skill();
             skill.skillType = selectSkill;
             skill.save(function(err){
               if(err) throw err;
             });
           }
         });
       }
       var id = req.body._id;
       Applicant.updateOne({_id:id}, {"firstname":firstname, "lastname":lastname, "contacts":contacts, "skills":skills}, function(err, user){
         if(err) throw err;
         else res.json({success:true});
       });
    });
    //DELETE APPLICANT ROUTE
    router.delete('/appls/:applicantId', function(req, res){
      var deleteApplicant = req.params.applicantId;
      Applicant.findOne({_id:req.params.applicantId}, function(err, user){
        if(err) throw err;
        if(!user) res.json({success:false, message:'No user found'});
        else{
          Applicant.findOneAndRemove({_id:deleteApplicant}, function(err, user){
            if(err) throw err;
            else res.json({success:true});
          });
        }
      });
    });


    router.get('/appls/:applicantId', function(req, res){
      var getApplicant = req.params.applicantId;
      Applicant.findOne({_id:req.params.applicantId}, function(err, user){
        if(err) throw err;
        if(!user) res.json({success:false, message:'No user found'});
        else  res.json({success:true, user:user});
          });
    });
    router.get('/skills', function(req, res){
      Skill.distinct('skillType', function(err, skills){
        if(err) throw err;
        if(!skills) res.json({success:false, message:'No skills found'});
        else res.json({success:true, skills:skills});
      });
    });
    router.get('/contacts', function(req, res){
      Contact.distinct('contactType', function(err, contacts){
        if(err) throw err;
        if(!contacts) res.json({success:false, message:'No contacts found'});
        else res.json({success:true, contacts:contacts});
      });
    });
    router.use(function(req, res, next){
          var token = req.body.token || req.body.query || req.headers['x-access-token'];

          if(token){
            jwt.verify(token, secret, function(err, decoded){
              if(err) res.json({success:false, message:'Invalid token'});
              else {
                req.decoded = decoded;
                next();
              }
            });
          }
          else {
            res.json({success:false, message:'No token'});
          }
        });

    router.post('/current', function(req,res){
        res.send(req.decoded);
    });

  return router;
}
