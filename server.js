let express = require("express")
let app = express()
var mysql = require('mysql');
var moment = require('moment')
var twix = require('twix');



var db = mysql.createConnection({
  host     : process.env.HOST,
  user     : process.env.USER,
  password : process.env.PASSWORD
});

console.log(moment.utc().subtract(5, 'hour').format("L"))

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

app.use(express.static("./client"))

app.get("/admin",function(req,res){
  console.log("Request~",req)
  res.sendFile(__dirname+'/client/index.html')
})

app.get("/init", function(req, res){
  db.query("SELECT DISTINCT className FROM AllTheBase.Checkins", function (error, results, fields) {
    res.send(results)
  })
})


app.get("/studentnames", function(req, res){

  var q = req.query;
  console.log(q)
  var classNames;
  var attended;
  db.query("SELECT DISTINCT userName FROM AllTheBase.Checkins WHERE className="+'"' + q.class + '"', function (error, results, fields) {
    classNames=results;
  })
  db.query("SELECT DISTINCT userName FROM AllTheBase.Checkins WHERE dateCheckedIn="+'"' + q.date + '"', function (error, results, fields) {
    attended=results;
  })

  console.log(classNames)
  console.log(attended)
  var out = []
  for(name in classNames){
    if(attended.indexOf(name) === -1){
      out.push(name)
    }
  }

  res.send(out)

})

// app.get('/getclass', function(req, res) {
//    res.json({ querystring_breed: req.query.breed });
// });

app.get("/getclass", function(req, res){
var query = "SELECT * FROM AllTheBase.Checkins WHERE className = '" + req.query.class + "'"
  db.query(query, function (error, results, fields) {
    const start = moment(results[0].dateCheckedIn, "L")
    const end = moment(results[results.length-1].dateCheckedIn, "L")
    //console.log("min & max ",start, end)
    var itr = moment.twix(start,end).iterate("days");
    var range=[];
    while(itr.hasNext()){
        range.push(itr.next().toDate())
    }
    var newRange = range.reduce(function(a,e){
      a.push(moment(e).format("L"));
      return a
    },[])
    let out = {data:results, dates:newRange}
    res.send(out)
  })
})

app.post("/checkin",function(req,res){

  db.query("SELECT * FROM AllTheBase.Checkins WHERE userName = '"+req.body.user_name+"' AND className = '"+req.body.team_domain+"' AND dateCheckedIn = '" + moment.utc().subtract(5, 'hour').format("L")+ "';", function (error, results, fields) {
    if(error){
      console.log(error)
    } else {
      console.log(results)
      if(results.length){
        return res.send("Already Checked in for today, Good Job!")

      } else {
        db.query("INSERT INTO AllTheBase.Checkins (userName, className, dateCheckedIn) VALUES ('"+req.body.user_name+"', '"+req.body.team_domain+"', '"+ moment.utc().subtract(5, 'hour').format("L") +"');", function (error, results, fields) {
          if(error){
            console.log(error)
          } else {
            return res.send("Checked in!")
          }
      });
      }

    }

  })

})
app.listen(process.env.PORT || 1337)
