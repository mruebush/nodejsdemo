var express = require('express'); 
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/teams');

var app = express();
 
app.get('/teams', function(req, res) {
    res.send([{name:'Arsenal'}, {name:'Chelsea'}, {name:'Totteningham'}, {name:'Everton'}]);
});
app.get('/teams/:id', function(req, res) {
    res.send({id:req.params.id, name: "Chelsea", description: "The blues"});
});

app.listen(3000);
console.log('Listening on port 3000...');
module.exports = app;