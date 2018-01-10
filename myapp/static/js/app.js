'use strict'; // See note about 'use strict'; below

var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
    when('/', {
      templateUrl: "static/partials/home.html"
    }).
    when('/about', {
      templateUrl: "static/partials/about.html"
    }).
    when('/signin', {
      templateUrl: "static/partials/auth/signin.html",
      controller: "signinController"
    }).
    when('/signup', {
      templateUrl: 'static/partials/auth/signup.html',
      controller: "signupController"
    }).
    when('/profile', {
      templateUrl: 'static/partials/user/profile.html'
    }).
    when('/admin',{
      templateUrl: 'static/partials/admin/dashboard.html'
    })
    otherwise({
      redirectTo: '/'
    });
    $locationProvider.html5Mode(true);
  }
]);

//Controller to handle Signin
myApp.controller('signinController', ['$scope','$http','$window',
  function($scope, $http, $window) {
    $scope.signin = function signin() {
      //save the input from the sign in form
      $scope.userinput = {
        email: $scope.email,
        password: $scope.password
      }
      //send post request to our signin api
      $http.post('/api/signin', $scope.userinput)
        .then(function(data, status, headers, config){
          //save the token recieved from the api and saved in sessionStorage
          $window.sessionStorage.token = data.data.token;
          console.log("Token recieved from API : " + data.data.token);
          $scope.message = 'You are Logged in !';
        })
        .catch(function activateError(error) {
                alert('An error happened');
        });
       console.log($scope.userinput);
    };
  }
]);

//Controller to handle signup
myApp.controller('signupController', ['$scope','$http',
   function($scope, $http){
     $scope.signup = function signup(){
        //save the input from the signup form
        $scope.userinput = {
          email: $scope.email,
          password: $scope.password
        }
        //send post request to our signup
        $http.post('/api/signup', $scope.userinput)
          .then(function(data, status, headers, config){
              //save the user
              console.log("Status :" + data.data.status);
          });
     };
   }
]);
