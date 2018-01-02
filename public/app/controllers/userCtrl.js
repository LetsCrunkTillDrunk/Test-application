angular.module('userControllers',['userServices'])
.controller('regCtrl', function($http, $location, $timeout, User) {

  var app = this;

   this.regUser = function(regData){
     User.create(app.regData).then(function(data){
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
});
