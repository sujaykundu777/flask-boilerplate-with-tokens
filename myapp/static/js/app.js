'use strict'; // See note about 'use strict'; below

var myApp = angular.module('myApp', ['ngRoute','ngStorage']);

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
    otherwise({
      redirectTo: '/'
    });
    $locationProvider.html5Mode(true);
  }
]);

//Authentication Service
//1.saving the token in local storage
//2. reading the token from local Storage
//3. deleting the token from local Storage
//4. calling the register and login api end points
//5. checking whether a user is currently logged in
//6. getting the details of the logged in user from the Token


   //Controller to handle Signin
    myApp.controller('signinController',['$scope','AuthService', function($scope, AuthService) {
        //Call to signin
        $scope.signin = function(){
          $scope.credentials = {
             email: $scope.email,
             password: $scope.password
          };
          //call the authentication signin service
          AuthService.Login($scope.credentials);
        };
      }]);

//Create Auth Factory
myApp.service('AuthService', function($http, $sessionStorage){

    this.Login = function(credentials) {
    console.log("Email: " + credentials.email, "Password: " + credentials.password);
        $http
        .post('http://localhost:3000/api/signin', credentials)
        .then(function(response, status, headers, config){
         //save the token recieved from the api and saved in sessionStorage
         $sessionStorage.token = response.data.token;
         console.log("Token recieved from API : " + $sessionStorage.token);
        })
        .catch(function activateError(error){
            console.log(error);
        });
    };

});



//Controller to handle signup
myApp.controller('signupController', ['$scope','$http',
   function($scope, $http){
     $scope.signup = function signup(){
        //save the input from the signup form
        $scope.userinput = {
          email: $scope.email,
          password: $scope.password
        };
        //send post request to our signup
        $http.post('/api/signup', $scope.userinput)
          .then(function(data, status, headers, config){
              //save the user
              console.log("Status :" + data.data.status);
          });
     };
   }
]);
