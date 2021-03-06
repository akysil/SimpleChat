var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var port = 8888;

server.listen(port, function() {
    console.log('server listen port ' + port);
});

var mongo = require('mongodb');
var host = "mongodb://localhost:27017/chat";
var MongoClient = mongo.MongoClient;

MongoClient.connect(host, function(error, db) {

    if (error) throw error;
    var collection = db.collection('messages');

    app.use(express.static(__dirname + '/dist'));

    app.get('/', function(req, res){
        res.sendFile('/index.html');
    });

    app.get('/temp.html', function(req, res){
        res.sendFile('/temp.html');
    });
    
    app.get('/list.json', function(req, res) {
        
        collection.find().toArray(function(error, results) {
            res.contentType('json');
            res.send(JSON.stringify(results), {}, 200);
        });

    });

    io.on('connection', function(socket) {
        socket.on('chat message', function(msg) {
            collection.insert(msg, {safe:true}, function(error, obj) {
                if (error) throw error;
                io.emit('chat message', msg);
            });
        });
    });

})
