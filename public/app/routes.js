var app = angular.module('appRoutes',['ngRoute'])
.config(function($routeProvider, $locationProvider){
  $routeProvider

  .when('/', {
    templateUrl: '/app/views/pages/home.html',
    controller: 'applCtrl',
    controllerAs: 'applicant'
  })

  .when('/register', {
    templateUrl:'/app/views/pages/users/register.html',
    controller: 'regCtrl',
    controllerAs: 'register',
    isAuth:false
  })

  .when('/login', {
    templateUrl:'/app/views/pages/users/login.html',
    isAuth:false
  })

  .when('/logout', {
    templateUrl: '/app/views/pages/users/logout.html',
    isAuth:true
  })

  .when('/application', {
    templateUrl:'/app/views/pages/users/application.html',
    controller: 'subCtrl',
    controllerAs: 'submit',
    isAuth:true
  })

  .when('/edit/:id', {
    templateUrl:'/app/views/pages/users/edit.html',
    controller: 'editCtrl',
    controllerAs :'edit',
    isAuth: true
  })

  .when('/profile', {
    templateUrl:'/app/views/pages/users/profile.html',
    isAuth:true
  })
  .otherwise({redirectTo:'/'});

  $locationProvider.html5Mode({
    enabled:true,
    requireBase:false
  });
});

app.run(['$rootScope', 'Auth', '$location', function($rootScope, Auth, $location){
  $rootScope.$on('$routeChangeStart', function(event, next, current){
    if(next.$$route.isAuth == true){
        if(!Auth.isLogin()) {
          event.preventDefault();
          $location.path('/');
        }
    }
    else if(next.$$route.isAuth == false){
      if(Auth.isLogin()) {
        event.preventDefault();
        $location.path('/');
      }
    }
    else{

    }
  });
}]);
