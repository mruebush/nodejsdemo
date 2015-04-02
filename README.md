# nodejsdemo
Demo code for Node.js presentation I do. It basically gets you started with node.js development and shows off using various tools from testing and debugging to managing documentation.

##Hello World and the 3 line http server - lets make sure node is installed correctly and test the basics
Navigate to www.nodejs.com and install the node.js
Now create a directory called helloworld:
    mkdir helloworld
Then create a file called hello.js and put the following code in it:
    var http = require('http');
    http.createServer(function(req, res) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Hello World\n');
    }).listen(3000, '127.0.0.1');
    console.log('Serving hellos from http://127.0.0.1:3000/ since ' + new Date());

That was fun, now I want to build a real application. Well then you need to learn some things.

##npm and package.json
You can use npm to install packages from the public node repo.

The file package.json stores information about your node program. Most developers don't pay enough attention to this file and just use it to track dependencies, but it can contain so much more and is extensively used by npm to understand your program. It contains the name, description and version of your program include dependencies on other libraries. You can include the license and the location of the code in the repository along with urls to report bugs. It even supports scripts that you can use npm to run. Great for running tests or other commands needed during the build cycle. You are likely to utilize this file more if you publish your program as a component and deploy with npm.

    npm install <package name>
to install a package to the local node_modules directory of your project from the npm repository. If node_modules does not exist, it will be created. You can shorten this to 
    npm i <package name> 
if you like to save key strokes, but nobody really does...hmmm...
Better yet,
    npm install <package name> --save
to install the package to the package.json in the dependencies section or in the case of mocha test framework or other libraries you may only use during development
    npm install <package name> --save-dev
save to the package.json in the devDependencies section.

Each package is a gzipped tarball 
Each package brought down has its own directory and package.json and component.json to help npm manage dependencies. Take the time to quickly look at the node_modules directory and what is in it.
You can also install a package globally using the 
    -g
option. On Linux/Mac this means that they are installed in the lib/node_modules directory (in /usr/local by default and node is in /usr/bin by default) and on Windows just the node_modules directory in the same directory where node.exe is installed
    --force
to force to install from repo, even if the local version exists (could be corrupted or more likely the other development team forgot to increment their version number and you want to test with the latest changes)
You can also install a particular tag and version using the
    npm install async@latest
    npm install async@1.0.0
If you need to install more than one package, you can do the following
    npm install async lodash sax@0.1.1
npm is not limited to the official npm repository for installs, but can also point to files or tarballs on your file system or served from a url. Great if you need to share code between teams.
    npm shrinkwrap
to lock down dependencies. Generates an npm-shrinkwrap.json file that has the exact versions of the libraries you are using. Check this in with your project and then run npm install and it will use the npm-shrinkwrap.json, instead of the package.json for the installs. 

##Create an Express application
Express is a framework to make it easier to create http and restful applications with node.js. It provides a basic structure and this is referred to as an express workflow. We are going to add directories to the basic express workflow for test, config, models, resources to support additional workflows as we mature the application.

Create a new file called futball.js and add the following code to it:
    var express = require('express'); 
    var app = express();
 
    app.get('/teams', function(req, res) {
        res.send([{name:'Arsenal'}, {name:'Chelsea'}, {name:'Totteningham'}, {name:'Everton'}]);
    });
    app.get('/teams/:id', function(req, res) {
        res.send({id:req.params.id, name: "Chelsea", description: "The blues"});
    });
 
    app.listen(3000);
    console.log('Listening on port 3000...');
    module.export = app;

This creates a API for teams that we can test by running and directing the browser to:
    http://localhost:3000/teams
    http://localhost:3000/teams/10

Cool! we have an API that we can hook a client to.

##Keeping the Server Running
It is getting a little annoying having to press ctrl-C and then restart the server everytime we make changes.
nodemon is a package that allows the server to automatically refresh when you save your server when you make changes.
    npm install nodemon -g

##Debugging node.js
node-inspector is a package to handle debugging installing and instructions on how to step through code.
    npm install node-inspector -g
node-debug bin/www start the debugger, launch the browser and start a debugging session on port 5858.

##Error Handling
Recommended approach from node.js:

    var domain = require('domain').create();
    domain.on('error', function(err){
        console.log(err);
    });

    domain.run(function(){
        throw new Error('NewError');
    });

##Testing - Do it
I will use mocha as my javascript test runner, but there are others, pick one and put it in your development pipeline.
How do we install it? 
    npm install -g mocha --save-dev

Now let's test our teams service. To make it easier to write tests against our service, lets install supertest. 
Supertest is a framework that uses super-agent to test against HTTP servers (think REST APIs or even HTML). Adds HTTP assertions
    npm install supertest --save-dev
or for later...wink...wink...
    npm install supertest-as-promised
This adds the .then method to your supertest to avoid layering callbacks (see further down).



Create a test directory to save our tests inside of our project folder.
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

see https://www.npmjs.com/package/supertest and https://www.npmjs.com/package/mocha

Code coverage with istanbul
 after you get your mocha tests to pass. Code coverage will show you what percentage of your code is covered by tests. 100% would be ideal, but rare...

    npm install -g istanbul
    istanbul cover _mocha -- -R spec
    open coverage/lcov-report/index.html

Add the following to the "scripts" section of your package.json and then just npm run coverage to get the same effect:
    "coverage": "./node_modules/istanbul/lib/cli.js cover ./node_modules/mocha/bin/_mocha -- --ui bdd -R spec -t 5000

Now, we are putting together a number of tools, we should automate the devops pipeline a bit to make it easier on us.

##Gulp
Gulp uses 5 methods to configure your devops pipeline:
    task, run, watch, src, and dest

Install Gulp:
    npm install gulp -g
    npm install gulp --save-dev

Install the gulp plugins that we want to use
    npm install gulp-jshint gulp-concat gulp-uglify gulp-rename gulp-istanbul gulp-mocha --save-dev    

Putting everything in one file will get difficult to maintain as the application grows, so let's start to organize things a bit.

##Show where to serve up images/static artifacts
public by default, but you can change if it suits you. This is not fast, you get orders of magnitude speed difference if you use something like nginx or apache and of course you would want to cache it on a CDN.

##Routing

##Documentation with swagger api swagger-node-express package

##Hook to a database

##Now, lets look at a few best practices - Node patterns
Talk about async programming patterns and the mindshift as you try to move from iterative, request and response patterns.

Show the pyramid of doom and queue the shark music.

This can get old, with each error check. It is why I liked the supertest-as-promise above.
Also, go through an if statement with a function call and how you need to change your style.
Use promises and async - mention reactive

##Now lets set up a chat channel and notifications through socket.io

##Then, we need to authenticate the user, Intro to Passport.

##How do we deploy for scale
