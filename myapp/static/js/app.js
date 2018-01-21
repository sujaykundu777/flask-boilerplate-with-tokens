'use strict'; // See note about 'use strict'; below

var myApp = angular.module('myApp', ['ngRoute', 'ngStorage', 'ngCookies']);

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
    when('/logout',{
      templateUrl: '',
      controller: "logoutCtrl"
    }).
    otherwise({
      redirectTo: '/'
    });
    $locationProvider.html5Mode(true);
  }
]);



//Authentication Service

//Signin  :
//1. Check if user is valid or not (check credentials)
//2. if its a valid user , Generate a token from the API (backend)
//3. set credentials globally for Successfull login in ( cookieStorage)
//4. Pass the headers for authorization to the protected urls
//5. Access the global varibles using g

//


//2. reading the token from local Storage
//3. deleting the token from local Storage
//4. calling the register and login api end points
//5. checking whether a user is currently logged in
//6. getting the details of the logged in user from the Token



      //Controller to handle Signin
      myApp.controller('signinController', ['$scope', '$http', '$location', '$cookies', '$localStorage', 'AuthService', function($scope, $http, $location, $localStorage, $cookies, AuthService) {

        //reset login status
        AuthService.ClearCredentials();

        //Call to signin
        $scope.signin = function() {

          //get data from login form
          $scope.credentials = {
            email: $scope.email,
            password: $scope.password
          };

          //pass the data to the authentication service to check if the username and password is correct
          AuthService.Login($scope.credentials, function(response) {

            //If callback is returned true from api
            if (response) {
              console.log("Login Successful");
              console.log(response);
              // If authentication is Successfull
              $location.path('/dashboard');
            }
            else {
              //If callback is returned without response
              //Redirect back to signin
              $location.path('/signin');
              console.log(" Login Error ");
            }
          });
        };
      }]);

        myApp.controller('logoutCtrl', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService){
          $scope.logout = function(){

                AuthService.ClearCredentials();

          };
              $location.path('/');
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
      myApp.service('AuthService', function($http, $rootScope, $location, $cookies) {

        //for login
        this.Login = function(credentials, callback) {

          //here we check if the username and password is correct

          $http
            .post('/api/signin', credentials)
            .then(function(response) {
              callback(response);
            })
            .catch(function activateError(error) {
              console.log(error);
            });
        };


        //for registration
        this.Register = function(credentials) {
          console.log("Email: " + credentials.email);
          //send post request to our signup
          $http
            .post('/api/signup', credentials)
            .then(function(response, status, headers, config) {
              //save the user
              console.log("User Saved Successfully");
            });
        };

        //service to set credentials globally
        this.SetCredentials = function(credentials) {

          //save the details of the loggedin globally

          $rootScope.globals = {
            currentUser: {
              email: credentials.email
            }
          };

          // set default auth header for http requests
          $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.token;

          //save the details in cookie Storage
          // store user details in globals cookie that keeps user logged in for 1 week (or until they logout)
          var cookieExp = new Date();
          cookieExp.setDate(cookieExp.getDate() + 7);
          $cookies.putObject('globals', $rootScope.globals, {
            expires: cookieExp
          });

        };

        //service for clearing credentials
        this.ClearCredentials = function() {

          $rootScope.globals = {};
          $cookies.remove('globals');
          $cookies.remove('token');
          $http.defaults.headers.common.Authorization = 'Basic';
           console.log('cleared credentials');
        };

      });
