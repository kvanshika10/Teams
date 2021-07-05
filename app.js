//jshint esversion:6
const express=require("express");
const app=express();
const server=require("http").Server(app);
const io=require("socket.io")(server);
const bodyParser=require("body-parser");




app.set("view engine","ejs");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
server.listen(3000,function(){
  console.log("Server started");

});
app.get("/",function(req,res){

   res.sendFile(__dirname+"/index.html");

});

app.post("/",function(req,res){
  const room_Id=req.body.id;
  res.redirect("/"+room_Id);

});
app.get("/:room",function(request,response){

  response.render("room",{room_Id:request.params.room});
});
io.on("connection",socket => {
  socket.on('join-room',(room_Id,userId)=>{
    console.log(room_Id,userId);
    // current socket to join room
    socket.join(room_Id);
    // send it to whole room except the one who joined
    socket.to(room_Id).emit('user-connected',userId);
  });
});
