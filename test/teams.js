var app = require('../firstapp'),
 request = require('supertest');

 describe('demoapp teams api', function(){
    describe('when requesting resource /teams', function(){
        it('should respond with 200', function(done){
            request(app)
            .get('/teams')
            .expect(200, done);
        });
    });
 });

  describe('demoapp teams api', function(){
    describe('when requesting resource /teams', function(){
        it('should respond with a list of teams', function(done){
            request(app)
            .get('/teams')
            .expect([{name:'Arsenal'}, {name:'Chelsea'}, {name:'Totteningham'}, {name:'Everton'}], done);
        });
    });
 });