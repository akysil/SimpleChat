
/* App Module */

var app = angular.module('app', ['ngMaterial']);

/* App Config */

app.config(['$mdThemingProvider', function ($mdThemingProvider) {
    $mdThemingProvider.theme('altTheme').primaryPalette('purple');
}]);

/* App Run */

app.run(['$rootScope', function ($rootScope) {
    
    //

}]);

/* App Controllers */

app.controller('AppCtrl', ['$scope', function($scope) {
  var imagePath = 'http://ww1.prweb.com/prfiles/2014/04/10/11752526/gI_134971_best-image-web-hosting.png';

  $scope.todos = [];
  for (var i = 0; i < 15; i++) {
    $scope.todos.push({
      face: imagePath,
      what: "Brunch this weekend?",
      who: "Min Li Chan",
      notes: "I'll be in your neighborhood doing errands."
    });
  }
}]);

/* Directives */

app.directive('header', ['socket', 'Source', function (socket, Source) {
    
    return function (scope) {
        
        scope.send = function() {
            socket.emit('chat message', { username: scope.username, message: scope.message });
            scope.message = '';
        };

        socket.on('chat message', function(messageObject) {
            Source.set(messageObject);
        });
    };

}]);

app.directive('footer', ['Source', function (Source) {
    
    return function (scope) {

        scope.$watch(function() {
            return Source.get();
        },
        function(newVal, oldVal) {
            scope.list = newVal;
        });

    };

}]);

/* App Services */

app.factory('Source', ['$http', function ($http) {

    var list;

    var httpConfig = {
        method: 'GET',
        url: '/list.json'
    };

    $http(httpConfig)
        .success(function (data, status, headers, config) {
            list = data;
        })
        .error(function (error, status, headers, config) {
            console.log(status + ': ' + error);
            list = [{ username: 'Error', message: 'Can not load messages' }];
        });

    return {
        get: function() {
            return list;
        },
        set: function(messageObject) {
            list.push(messageObject);
        }
    };

}]);

app.factory('socket', ['$rootScope', function ($rootScope) {

    var socket = io.connect();

    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };

}]);