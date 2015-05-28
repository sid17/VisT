'use strict';

angular.module('visualisationTool')
  .controller('LoginCtrl', ['$scope', '$rootScope', '$cookieStore', '$cookies', '$http', '$q', 'ENV', '$window', '$location', '$route', function($scope, $rootScope, $cookieStore, $cookies, $http, $q, ENV, $window, $location, $route) {

    $scope.base64encode = function(user) {
      return btoa(user.email+":"+user.password);
    }

    $scope.create_user = function(user) {
      var create_user_endpoint = ENV.apiEndpoint + 'auth/create_user/';
      var passwordScore = $(':password').pwstrength("calculateScore");
      if (passwordScore < 40) {
        swal("Sorry!", "Your password is not strong enough.", "error");
        return;
      }
      if (user.username.indexOf(' ') == -1) {
        swal("Sorry!", "Please enter a full name with a space between your first and last name.", "error");
        return;
      }
      var email_re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!email_re.test(user.email)) {
        swal("Sorry!", "Your email address seems to be invalid!", "error");
        return;
      }
      $q.when((function() {
          var val = $cookies.csrftoken;
          if (!val) {
            return $http.get(create_user_endpoint);
          }
          return "Ok";
        })())
        .then(function(response) {
          $http.defaults.headers.post['X-CSRFToken'] = $cookies['csrftoken'];
          return $http.post(create_user_endpoint, user);
        })
        .then(function(response) {
          $scope.login(user);
        }, function(error) {
          var message = error.data || "Something went wrong with your account creation.";
          swal("Sorry!", message, "error");
          $location.path( "/login" );
          $route.reload();
        });
    };

    $scope.login = function(user) {
      var login_endpoint = ENV.apiEndpoint + 'auth/login/';
      $q.when((function() {
          var val = $cookies.csrftoken;
          if (!val) {
            return $http.get(login_endpoint);
          }
          return "Ok";
        })())
        .then(function(response) {
          $http.defaults.headers.post['X-CSRFToken'] = $cookies['csrftoken'];
          var encodedCredentials = user ? $scope.base64encode(user) : null;
          return $http.post(login_endpoint, encodedCredentials);
        })
        .then(function(response) {
          var user = response.data;
          $scope.setCurrentUser(user);
          // If returns loggedin, than this is an automated login.
          if (!response.data.hasOwnProperty('loggedin')) {
            $location.path( "/" );
            $window.location.reload();
          }
        }, function(error) {
          if (user) {
            swal("Sorry!", "We couldn't validate your login credentials", "error");
          }
        });
    };

    $scope.setCurrentUser = function(user) {
      $rootScope.user = user;
      $scope.user = user;
    };

    $scope.logout = function() {
      var logout_endpoint = ENV.apiEndpoint + 'auth/logout/';
      swal({
          title: "Oh no! Don't go!",
          text: "Are you sure you want to log out?",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Logout",
          cancelButtonText: "Stay logged in"
        }, function(isConfirm) {
          if (isConfirm) {
            $q.when((function() {
              var val = $cookies.csrftoken;
              if (!val) {
                return $http.get(login_endpoint);
              }
              return "Ok";
            })())
            .then(function(response) {
              $http.defaults.headers.post['X-CSRFToken'] = $cookies['csrftoken'];
              return $http.post(logout_endpoint);
            })
            .then(function(response) {
              $scope.setCurrentUser(null);
              swal("Ok!", "You've successfully logged out.", "success");
              $location.path( "/" );
              $route.reload();
            });
        }
      });
    }

    $scope.loadPasswordChecker = function() {
      var options = {
        onLoad: function () {
            $('#messages').text('Start typing password');
        },
        onKeyUp: function (evt) {
            $(evt.target).pwstrength("outputErrorList");
        }
      };
      $(':password').pwstrength(options);
    };

    $scope.login();

  }]);
