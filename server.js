let express = require("express")
let app = express()
var mysql = require('mysql');
var moment = require('moment')


var db = mysql.createConnection({
  host     : process.env.HOST,
  user     : process.env.USER,
  password : process.env.PASSWORD
});



db.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + db.threadId);
});

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/",function(req,res){
  console.log("Request~",req)
  res.send("Server-UP")
})
app.post("/checkin",function(req,res){

  //user_name
  //team_domain
  // moment().format('L'); // 01/14/2013
  db.query('SELECT * FROM AllTheBase.Checkins', function (error, results, fields) {

    if(error){
      console.log(error)
    } else {
      console.log(results)
    }

});
  //console.log(req.body)
  res.send('standby')
})
app.listen(process.env.PORT)
