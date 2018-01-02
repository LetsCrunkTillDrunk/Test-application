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
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+'/public'));
app.use('/api',appRoutes);

mongoose.Promise = global.Promise;
//mongodb://<dbuser>:<dbpassword>@ds239097.mlab.com:39097/human-resource
//mongodb://localhost:27017/humar-resources
//var url = "mongodb://localhost:27017/humar-resources";
var url = "mongodb://Kimiko:999999@ds239097.mLab.com:39097/human-resource";
// mongoose.connect('mongodb://Mediff:17q46z5w@ds239097.mLab.com:39097/human-resource', { useMongoClient:true }, function(err)
// {
// if(err)
//   console.log('Not connected to database: ' + err);
// else {
//   console.log('Successfully connected');
// }
// });

MongoClient.connect(url, function(err, db){
  if(err) console.log("Error is " + err);
  else console.log("Connection established to " + url);
});


app.get('*', function(req,res){
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

var port = process.env.PORT || 8080;
app.listen(port, function(){
  console.log('Running the server on port ' + port);
});
