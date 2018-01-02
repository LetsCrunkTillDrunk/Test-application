angular.module('subServices' ,[])
.factory('Applicant', function($http){
  var applicantFactory = {};
  applicantFactory.addApplicant = function(subData){
    return $http.post('/api/applicant', subData);
  };
  applicantFactory.getAllApplicants = function(){
    return $http.get('/api/appls');
  };
  applicantFactory.deleteApplicant = function(applicantId){
    return $http.delete('/api/appls/' + applicantId);
  };
  applicantFactory.getApplicant = function(applicantId){
    return $http.get('/api/appls/' + applicantId);
  };
  applicantFactory.postApplicant = function(editData){
    return $http.post('/api/appls', editData);
  };
  applicantFactory.getAllSkills = function(){
    return $http.get('/api/skills');
  };
  applicantFactory.getAllContacts = function(){
    return $http.get('/api/contacts');
  };


  return applicantFactory;
});
