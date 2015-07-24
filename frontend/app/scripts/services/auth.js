'use strict';

app.factory('AuthService', function ($http,$window, $q,$rootScope,ngNotify) {

  var authenticate = function (username, password, endpoint) {
    var url = config.logInEndPoint + endpoint;
    var deferred = $q.defer();

    $http.post(url, 'username=' + username + '&password=' + password, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(
      function (response) {
        var token = response.data.token;
        var username = response.data.username;

        if (token && username) {
          $window.localStorage.token = token;
          $window.localStorage.username = username;
          deferred.resolve(true);
        } else {
          deferred.reject('Invalid data received from server');
        }
      },
      function (response) {
        deferred.reject(response.data.error);
      }
    );
    return deferred.promise;
  };

  var logout = function () {
    var deferred = $q.defer();
    var url = config.logInEndPoint + 'logout/';

    $http.post(url).then(
      function () {
        $window.localStorage.removeItem('token');
        $window.localStorage.removeItem('username');
        $rootScope.username=''
        $rootScope.loggedIn=false
         ngNotify.set('You are successfully logged out',{type:'success',position: 'top'});

        deferred.resolve();
      },
      function (error) {
        deferred.reject(error.data.error);
      }
    );
    return deferred.promise;
  };

  var submitToLog = function () {
    var query=$rootScope.queryContents;
    console.log(query)
    var deferred = $q.defer();
    var url = config.logInEndPoint + 'process/';

    $http.post(url, 'query='+JSON.stringify(query),{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(
      function (response) {  
        deferred.resolve(response);
      },
      function (error) {
        deferred.reject(error.data.error);
      }
    );
    return deferred.promise;
  };


    var setConfiguration = function (query) {
    var deferred = $q.defer();
    var url = config.logInEndPoint + 'config/';
    console.log(query);
    $http.post(url, 'query='+query,{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(
      function (response) {  
        deferred.resolve(response);
      },
      function (error) {
        deferred.reject(error.data.error);
      }
    );
    return deferred.promise;
  };







  return {
    register: function (username, password) {
      return authenticate(username, password, 'register/');
    },
    login: function (username, password) {
      return authenticate(username, password, 'login/');
    },
    logout: function () {
      return logout();
    },
    submitToLog: function () {
      return submitToLog();
    },
    setConfiguration: function (query) {
      return setConfiguration(query);
    }
  };

});
