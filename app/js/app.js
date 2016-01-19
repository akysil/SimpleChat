angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
});

var app = angular.module('app', ['ngMaterial']);

app.config(['$mdThemingProvider', function ($mdThemingProvider) {
    
    // Theme config
    $mdThemingProvider.theme('default')
    .primaryPalette('blue-grey')
    .accentPalette('red');
}]);

app.run(['$rootScope', function ($rootScope) {
    
    // Initial variables
    $rootScope.appName = 'Simple Chat';

}]);

app.directive('html', ['Socket', 'Source', function (Socket, Source) {
    
    return function (scope) {
        
        // Send message
        scope.send = function() {
            Socket.emit('chat message', { username: scope.username, message: scope.message });
            scope.message = '';
        };

        // Receive message
        Socket.on('chat message', function(messageObject) {
            
            // Add message to the list
            Source.set(messageObject);
        });

        // Get init messages from Source service
        scope.$watch(function() {
            return Source.get();
        }, function(newVal, oldVal) {
            scope.list = newVal;
        });
    };

}]);

// Get init messages from service
app.factory('Source', ['$http', function ($http) {

    var list;

    var httpConfig = {
        method: 'GET',
        url: '/list.json'
    };

    $http(httpConfig)
        .success(function (data, status, headers, config) {
            if(data.length) {
                list = data;
            } else {
                list = [{ username: 'Chat Bot', message: 'Hello World' }];
            }
            
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

// Socket angular decorator
app.factory('Socket', ['$rootScope', function ($rootScope) {

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