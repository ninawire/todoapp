var bodyParser = require('body-parser');
const mongoose = require('mongoose')

const dbURI = 'mongodb+srv://ninawire:135790@todo.ejikd.mongodb.net/todo?retryWrites=true&w=majority'
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => console.log('connected to db'))
    .catch((err) => console.log(err));


var urlencodedParser = bodyParser.urlencoded({extended: false});

//create schema - blueprint
var todoSchema = new mongoose.Schema({
    item: String
});

var Todo = mongoose.model('Todo', todoSchema)


module.exports = function(app){

    app.get('/todo', function(req, res){
        //get data from db and pass to view
        Todo.find({}, function(err, data) {
            if (err) throw err;
            res.render('todo', {todos: data});
        });
    });

    app.post('/todo', urlencodedParser, function(req, res){
        //get data from the view and add it to db
            var newTodo = Todo(req.body).save(function(err, data){
            if (err) throw err;
            res.json(data);
        });
    });

    app.delete('/todo/:item', function(req, res){
        //deleted requested item from db
        Todo.find({item: req.params.item.replace(/\-/g, " ")}).deleteOne(function(err, data){
            if (err) throw err;
            res.json(data);
        });
    });
};