//jshint esversion:6
const express=require("express");
const app=express();
const server=require("http").Server(app);
const io=require("socket.io")(server);
const bodyParser=require("body-parser");


app.listen(3000,function(){
  console.log("Server started");

});
app.set('views', __dirname + '/views');
app.set("view engine","ejs");


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());

app.get("/",function(req,res){

   res.sendFile(__dirname+"/index.html");
   console.log("hi");
});

app.post("/",function(req,res){
  const room_Id=req.body.id;
  res.redirect("/"+room_Id);
  app.get("/"+room_Id,function(request,response){

    response.render("room");
     });
});

app.use(express.static("public"));
