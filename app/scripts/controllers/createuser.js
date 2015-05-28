'use strict';

/**
 * @ngdoc function
 * @name roboBrainApp.controller:CreateUserCtrl
 * @description
 * # CreateUserCtrl
 * Controller of the roboBrainApp
 */
angular.module('visualisationTool')
  .controller('CreateUserCtrl', ['$scope', '$cookieStore', '$cookies', '$http', '$q', 'ENV', function($scope, $cookieStore, $cookies, $http, $q, ENV) {
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
        });
    };

    $scope.user = {}


  }]);
