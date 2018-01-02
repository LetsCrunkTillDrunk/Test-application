var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);
var app = express();
var passport = require('passport');
var facebook = require('./app/passport/passport')(app, passport);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));
app.use('/api',appRoutes);

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/humar-resources', { useMongoClient:true }, function(err)
{
if(err)
  console.log('Not connected to database: ' + err);
else {
  console.log('Successfully connected');
}
});

app.get('*', function(req,res){
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

var port = process.env.PORT || 8080;
app.listen(port, function(){
  console.log('Running the server on port ' + port);
});
