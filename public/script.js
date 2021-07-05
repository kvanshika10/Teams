//jshint esversion:6
const socket = io("/");
const myPeer= new Peer(undefined,{
  host:'/',
 port:'3001'
});
myPeer.on('open',id=>{
  socket.emit('join-room',Room_ID,id);
})


// if the user gets connected
socket.on('user-connected',userId=>{
  console.log('User connected'+userId);
});
