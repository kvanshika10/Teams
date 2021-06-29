//jshint esversion:6
const express=require("express");
const app=express();
app.listen(3000,function(){
  console.log("Server started");

});
app.get("/",function(req,res){
   res.sendFile(__dirname+"/index.html");
   console.log("hi");
});
