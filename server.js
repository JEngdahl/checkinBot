let express = require("express")
let app = express()

app.get("/",function(req,res){
  console.log("Request~",req)
  res.send("success")
})
app.post("/checkin",function(req,res){
  console.log("Request~",req)
  res.send("Request",req)
})
app.listen(process.env.PORT)
