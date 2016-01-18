
/* App Module */

var app = angular.module('app', []);

/* App Config */

app.config([function () {
    
}]);

/* App Run */

app.run(['$rootScope', function ($rootScope) {
    
    //

}]);

/* Directives */

app.directive('main', ['socket', 'Source', function (socket, Source) {
    
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

/* App Controllers */

app.controller('mainCtrl', ['$scope', function ($scope) {

    //

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