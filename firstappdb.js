var express = require('express'); 
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/teams');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
 
// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.get('/teams', function(req, res) {
    var db = req.db;
    var collection = db.get('teams');
    collection.find({},{},function(e,docs) {
        res.send(docs);
    });
});

app.get('/teams/:id', function(req, res) {
    res.send({id:req.params.id, name: "Chelsea", description: "The blues"});
});

//create a new team
app.post('/teams', function(req, res) {
    console.log(req.body);
    if(!req.body.hasOwnProperty('teamName') || 
         !req.body.hasOwnProperty('gameTime')) {
        res.statusCode = 400;
        return res.send('Error 400: Post syntax incorrect.');
    } 

    var teamName = req.body.teamName;
    var gameTime = req.body.gameTime;

//should validate all input, big cause of security issues
console.log("Validate Name");
    var ck_name = /^[A-Za-z0-9 ]{3,20}$/;
    if (!ck_name.test(teamName)) {
       res.statusCode = 400;
       return res.send("Error 400: Team name data is not correct.");
    }
console.log("Validate Time");
    if (!ck_name.test(gameTime)) {
       res.statusCode = 400;
       return res.send("Error 400: Game start time data is not correct.");
    }

    var db = req.db;

    var collection = db.get('teams');

    collection.insert({
        "name" : teamName,
        "gameTime" : gameTime
    }, function (err, doc) {
        if (err) {
            res.statusCode = 500;
            res.send("Error 500: There is a problem with the server.");
            console.log(err);
        }
    });
});

app.listen(3000);
console.log('Listening on port 3000...');
module.exports = app;