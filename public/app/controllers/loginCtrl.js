angular.module('loginControllers',['authServices'])
.controller('loginCtrl', function(Auth, $timeout, $location, $rootScope){
  var app = this;
  app.loadPreserve = false;
  $rootScope.$on('$routeChangeStart', function(){
    if(Auth.isLogin())
    {
      app.isLogged = true;
      Auth.getUser().then(function(data){
        app.currentUser = data.data.username;
        app.email = data.data.email;
        app.loadPreserve = true;
      });
    }
    else {
      app.isLogged = false;
      app.currentUser='';
      app.loadPreserve = true;
    }

  });

  this.login = function(loginData){
    Auth.logIn(app.loginData).then(function(data){
     app.errorMsg = false;
     app.successMsg = false;
     console.log(data.data.success);
     console.log(data.data.message);
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

this.logout = function(){
  Auth.logOut();
  $location.path('/logout');
  $timeout(function(){
    $location.path('/');
  }, 3000);
};

});
