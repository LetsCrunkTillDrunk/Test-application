angular.module('userApp',['appRoutes', 'userControllers', 'userServices', 'authServices', 'subServices','loginControllers', 'applicationControllers'])

.config(function($httpProvider){
  $httpProvider.interceptors.push('AuthIntercept');
});
