angular.module('applicationControllers', ['subServices'])
.controller('applCtrl', function(Applicant, $timeout, $location){
  var app = this;
  var itemsPerPage = 5;
  var isSortedbyName = false;
  var isSortedByDate = true;
  app.applicantsList=[];
  app.pages=[];
    function getApplicants()
    {
        app.applicantsList = [];
        Applicant.getAllApplicants().then(function(data){
        app.errorMsg = false;
        app.successMsg = false;
        if(data.data.success)
        {
          app.successMsg = data.data.message;
          app.applicants = data.data.applicants;
          for(var i = 0; i < app.applicants.length/itemsPerPage; i++)
          {
            app.pages.push(i);
          }
          for(var i = 0; i < itemsPerPage; i++ )
          {
            if(app.applicants[i] == undefined) break;
            app.applicantsList.push(app.applicants[i]);
          }
        }
        else {
          app.errorMsg = data.data.message;
        }
      });
    }

      getApplicants();
      this.deleteApplicant = function(applicantId){
      Applicant.deleteApplicant(applicantId).then(function(data){
        if(data.data.success)
          getApplicants();
        else {
          app.errorDeleteMessage = data.data.message;
        }
      });
    }
    this.pageChange = function(pageId){
      app.applicantsList=[];
      for(var i = (pageId)*itemsPerPage, l = 0 ; l < itemsPerPage; i++, l++ )
      {
        if(app.applicants[i] == undefined)  break;//app.applicantsList.push({show:true});
        else app.applicantsList.push(app.applicants[i]);
      }
    }

    this.sortByName = function(){
      if(!isSortedbyName)
      {
         app.applicants.sort(function(a,b){return a.firstname.localeCompare(b.firstname)});
         isSortedbyName = true;
         isSortedByDate = false;
      }
      else
      {
         app.applicants.reverse();
         isSortedByDate = false;
      }
      app.pageChange(0);
    }
    this.sortByDate = function(){
      if(isSortedByDate)
      {
        app.applicants.reverse();
        isSortedbyName = false;
      }
      else {
        app.applicants.sort(function(a,b){return  new Date(a.placeDate) - new Date (b.placeDate)});
        isSortedbyName = false;
        isSortedByDate = true;
      }
      app.pageChange(0);
    }

    this.searchApplicants = function()
    {
        var search = document.getElementById('search').value;
        var querries = search.split(' ');

        app.applicantsList = [];
        for(var i = 0 ; i < app.applicants.length; i++)
        {
          for(var j = 0; j < querries.length; j++)
          {
            if(app.applicants[i].firstname == querries[j] || app.applicants[i].lastname == querries[j])
            {
              app.applicantsList.push(app.applicants[i]);
              break;
            }
            else
            {
              if('skills' in app.applicants[i])
              {
                for(var k = 0; k < app.applicants[i].skills.length; k++)
                {
                  if(app.applicants[i].skills[k].skillType == querries[j])
                  {
                    app.applicantsList.push(app.applicants[i]);
                    break;
                  }
                }
              }
            }
          }
        }
      }

})
.controller('editCtrl', function(Applicant, $location, $timeout){
  var app = this;
  var applicantId = $location.absUrl().split('/');
  var appId = applicantId[applicantId.length-1];
  app.isAddedContact = false;
  app.isAddedSkill = false;
  app.contactList = [];
  app.skillList = [];
  var contactIndex = 0;
  var skillIndex = 0;
  function getApplicant(id){
      Applicant.getApplicant(id).then(function(data){
        if (data.data.success)
        {
          app.editData = data.data.user;
          if (app.editData.contacts.length>0)  app.isAddedContact = true;
          for(var i = 0; i < app.editData.contacts.length;i++)
          {
              app.contactList.push({type:app.editData.contacts[i].contactType, value:app.editData.contacts[i].contactValue, id:contactIndex});
              contactIndex++;
          }

          if (app.editData.skills.length>0)  app.isAddedSkill = true;
          for(var i = 0; i < app.editData.skills.length;i++)
          {
              app.skillList.push({type:app.editData.skills[i].skillType, value:app.editData.skills[i].skillValue, id:skillIndex});
              skillIndex++;
          }
        }
      });
  }
  function getSkills(){
    Applicant.getAllSkills().then(function(data){
    app.errorMsg = false;
    app.successMsg = false;
    if(data.data.success)
    {
      app.successMsg = data.data.message;
      app.skillListStart = [];
      app.skillListStart = data.data.skills;
    }
    else {
      app.errorMsg = data.data.message;
    }
  });
  };

  function getContacts(){
    Applicant.getAllContacts().then(function(data){
    app.errorMsg = false;
    app.successMsg = false;
    if(data.data.success)
    {
      app.successMsg = data.data.message;
      app.contactListStart = [];
      app.contactListStart = data.data.contacts;
    }
    else {
      app.errorMsg = data.data.message;
    }
  });
  };

  getApplicant(appId);
  getSkills();
  getContacts();



  this.editUser = function(editData){
    this.editData.conData=[];
    this.editData.skillData=[];
    app.editData.conData= app.contactList;
    app.editData.skillData = app.skillList;
    Applicant.postApplicant(app.editData).then(function(data){
      if(data.data.success)
      {
        $timeout(function(){
          $location.path('/');
        }, 2000);
      }
    });
  };

  this.addNewContact = function(editData){
    this.isAddedContact=true;
    this.contactList.push({type:app.editData.conData.contactType, value:app.editData.conData.contactValue, id:app.contactIndex});
    app.contactIndex++;
  }

  this.addNewSkill = function(editData){
    this.isAddedSkill=true;
    this.skillList.push({type:app.editData.skillData.skillType, value:app.editData.skillData.skillValue, id:app.skillIndex});
    app.skillIndex++;
  }

  this.deleteContact = function(index){
    var i = app.contactList.findIndex(i=>i.id==index);
    app.contactList.splice(i,1);
  }

  this.deleteSkill = function(index){
    var i = app.skillList.findIndex(i=>i.id==index);
    app.skillList.splice(i,1);
  }
})

.controller('subCtrl', function(Applicant, $timeout, $location){
  var app = this;
  app.isAddedContact = false;
  app.isAddedSkill = false;
  app.contactList = [];
  app.skillList = [];
  app.contactIndex = 0;
  app.skillIndex = 0;


  function getSkills(){
    Applicant.getAllSkills().then(function(data){
    app.errorMsg = false;
    app.successMsg = false;
    if(data.data.success)
    {
      app.successMsg = data.data.message;
      app.skillListStart = [];
      app.skillListStart = data.data.skills;
    }
    else {
      app.errorMsg = data.data.message;
    }
  });
  };

  function getContacts(){
    Applicant.getAllContacts().then(function(data){
    app.errorMsg = false;
    app.successMsg = false;
    if(data.data.success)
    {
      app.successMsg = data.data.message;
      app.contactListStart = [];
      app.contactListStart = data.data.contacts;
    }
    else {
      app.errorMsg = data.data.message;
    }
  });
  };

  getSkills();
  getContacts();

  this.submitUser = function(subData){
    this.subData.conData=[];
    this.subData.skillData=[];
    app.subData.conData= app.contactList;
    app.subData.skillData = app.skillList;
    Applicant.addApplicant(app.subData).then(function(data){
     app.errorMsg = false;
     app.successMsg = false;
     if(data.data.success)
     {
        app.successMsg = data.data.message;
        $timeout(function(){
          $location.path('/');
        }, 2000);
     }
     else{
       app.errorMsg = data.data.message;
     }
   });
 };

 this.addNewContact = function(subData){
   this.isAddedContact=true;
   this.contactList.push({type:app.subData.conData.contactType, value:app.subData.conData.contactValue, id:app.contactIndex});
   app.contactIndex++;
 }

 this.addNewSkill = function(subData){
   this.isAddedSkill=true;
   this.skillList.push({type:app.subData.skillData.skillType, value:app.subData.skillData.skillValue, id:app.skillIndex});
   app.skillIndex++;
 }

 this.deleteContact = function(index){
   var i = app.contactList.findIndex(i=>i.id==index);
   app.contactList.splice(i,1);
 }

 this.deleteSkill = function(index){
   var i = app.skillList.findIndex(i=>i.id==index);
   app.skillList.splice(i,1);
 }

});
