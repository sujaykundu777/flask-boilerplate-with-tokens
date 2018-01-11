'use strict'; // See note about 'use strict'; below

var myApp = angular.module('myApp', ['ngRoute', 'ngStorage']);

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
    when('/dashboard', {
      templateUrl: 'static/partials/admin/dashboard.html'
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
//1.saving the token in local storage (Done)
//2. reading the token from local Storage
//3. deleting the token from local Storage
//4. calling the register and login api end points
//5. checking whether a user is currently logged in
//6. getting the details of the logged in user from the Token


//Controller to handle Signin
myApp.controller('signinController', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService) {

  //reset login status
  AuthService.ClearCredentials();

  //Call to signin
  $scope.signin = function() {
    $scope.credentials = {
      email: $scope.email,
      password: $scope.password
    };
    //call the authentication signin service
    AuthService.Login($scope.credentials, function(result) {
      if (result === true) {
        console.log('Logged in Successful');
        //redirect the user to profile page
        $location.path('/profile');
      } else {
        console.log('Login Error');
        $location.path('/signin');
      }
    });
  };
}]);

//Controller to handle signup
myApp.controller('signupController', ['$scope', 'AuthService', function($scope, AuthService) {
  $scope.signup = function() {
    //save the input from the signup form
    $scope.credentials = {
      email: $scope.email,
      password: $scope.password
    };
    //call the authentication signup service
    AuthService.Register($scope.credentials);
  };
}]);

//Create Auth Factory
myApp.service('AuthService', function($http, $location, $localStorage) {

  //for login
  this.Login = function(credentials, callback) {
    console.log("Email: " + credentials.email, "Password: " + credentials.password);
    $http
      .post('/api/signin', credentials)
      .then(function(response, status, headers, config) {
          //If token is received
        if (response.data.token) {

          //save the user details and token in localStorage
          $localStorage.currentUser = {
            email: credentials.email,
            token: response.data.token
          };

          // add auth token to auth header for all requests made by the $http service
          $http.defaults.headers.common.Authorization = 'Bearer ' + response.data.token;

          //execute callback with true for successful login
          callback(true);
        }
          //If token is not recieved
        else {
          //execute callback for failed login for failed login
          callback(false);
        }
      })
      .catch(function activateError(error) {
        console.log(error);
      });
  };

  //for registration
  this.Register = function(credentials) {
    console.log("Email: " + credentials.email, "Password: " + credentials.password);
    //send post request to our signup
    $http
      .post('/api/signup', credentials)
      .then(function(response, status, headers, config) {
        //save the user
        console.log("Status :" + response.data.status);
      });
  };

  //for clearing credentials
  this.ClearCredentials = function() {
    $localStorage.currentUser = '';
  };

  //to check if the user is logged in
  this.isLoggedIn = function() {

    //if the user is logged in access

  }

});
