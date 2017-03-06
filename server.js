//set up
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());

//configuration
mongoose.connect('mongodb://localhost/todoappdb');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
    console.log("we are connected");
});

//define model

var todoschema = new Schema({
    text : {
        type : String,
        required : true
    },
    complete : {
        type : Boolean
    }
});
var Todo = mongoose.model('Todo', todoschema);

//routes
//get all todos
app.get('/api/todos', function(req, res){
    Todo.find({'complete' : 'Y'}, function(err, todos){
        if(err){
            res.send(err);
        }
        res.json(todos);
    });
});

//create todo and send back all todos after creation
app.post('/api/todos', function(req, res){
    Todo.create({
        text : req.body.text,
        complete : 'Y',
        done : false
    }, function(err, todo){
        if(err){
            console.log(err);
            return;
        }
        Todo.find({complete : 'Y'}, function(err, todos){
            if(err){
                res.send(err);
            }
            res.json(todos);
        });
    });
});

//delete a todo
app.post('/api/todos/:todo_id', function(req, res){
    Todo.update({
        _id : req.params.todo_id
    }, {$set: {complete : false}}, function(err, todos){
        if(err){
            res.send(err);
        }
        Todo.find({complete : 'Y'}, function(err, todos){
            if(err){
                res.send(err);
            }
            res.json(todos);
        });
    });
});

//application
app.get('*', function(req, res){
    res.sendFile('index.html'); //load the single view file(angular will handle the page changes on the front end)
});

//listen
app.listen(8080);
// console.log("App is listening on port 8080");
