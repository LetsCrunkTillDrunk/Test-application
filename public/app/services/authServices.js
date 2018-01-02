angular.module('authServices',[])
.factory('Auth',function($http, AuthToken){
  var authFactory={};
  authFactory.logIn = function(loginData){
    return $http.post('/api/auth', loginData).then(function(data){
      AuthToken.setToken(data.data.token);
      return data;
    });
  };
  authFactory.logOut = function(){
      AuthToken.setToken();
  };

  authFactory.getUser = function(){
    if(AuthToken.getToken())
      return $http.post('/api/current');
    else $q.reject({message:'No token'});
  };

  authFactory.isLogin = function(){
    if(AuthToken.getToken()) return true;
    else return false;
  };
  return authFactory;
})

.factory('AuthToken', function($window){
  var authTokenFactory = {};
  authTokenFactory.setToken=function(token){
    if(token)
      $window.localStorage.setItem('token', token);
    else {
      $window.localStorage.removeItem('token');
    }
  };
  authTokenFactory.getToken=function(){
    return $window.localStorage.getItem('token');
  };
  return authTokenFactory;
})

.factory('AuthIntercept', function(AuthToken){
  var authInterceptFactory = {};
  authInterceptFactory.request = function(config){
    var token = AuthToken.getToken();
    if(token)
      config.headers['x-access-token'] = token;
    return config;
  };
  return authInterceptFactory;
});
