//jshint esversion:6
const socket = io("/");
const myPeer= new  Peer(undefined, {
  host: '/',
  port: '3001'
});
// remember to change interval
const vGrid=document.getElementById("video-grid");
const user=prompt("Enter your name");
// know all the user
const friends=[];

myPeer.on('open',id=>{
  socket.emit('join-room',Room_ID,id,user);
});
// video element
const myVideo=document.createElement('video');
// for ourself
myVideo.muted=true;
let myStream
navigator.mediaDevices.getUserMedia({
  video: true,
  audio:true

}).then(stream=> {
  myStream=stream;
   addVideoStream(myVideo,stream);
   // if someone tries to call us in order to view the stream in one browser
   myPeer.on('call',function(call){
     call.answer(stream);
     const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
  });


// if the user gets connected
socket.on('user-connected',userId=>{
  // this fnctn sends the current stream to that new user
setTimeout(() => {
    // user joined
    connectToNewUser(userId, stream);
  }, 1000);

  socket.on('user-disconnected',userId=>{
    if (friends[userId]) friends[userId].close()
  });
});


      });

function connectToNewUser(userId,stream){
  // by this we are sending the user our stream
  const call=myPeer.call(userId,stream);

   // Create a video element for another user
  const video=document.createElement('video');
    // when they send back their video Stream
  call.on('stream',function(userVideoStream){
    addVideoStream(video,userVideoStream);
    console.log("yeah");
  });

  call.on('close',function(){
    video.remove();

  });
friends[userId]=call;
}

function addVideoStream(video,stream){
  //Here srcobject return the source of media associated with video
  video.srcObject=stream;
  // as the data get loaded after that
  video.addEventListener("loadedmetadata",function(){
    video.play();

  });
  // append the video element to the page
   vGrid.append(video);
}



// for the functioning of mute button
$("#muteButton").on("click",function(){
  const activated = myStream.getAudioTracks()[0].enabled;
     if (activated==true) {
 myStream.getAudioTracks()[0].enabled = false;
// mute_btn.classList.toggle("background__red");
$("#muteButton").html('<i class="fas fa-microphone-slash"></i>');
} else {
 myStream.getAudioTracks()[0].enabled = true;
//mute_btn.classList.toggle("background__red");
 $("#muteButton").html('<i class="fas fa-microphone"></i>');
}
   });
// For the functioning of video button
$("#videoButton").on("click",function(){
  const activated = myStream.getVideoTracks()[0].enabled;
     if (activated==true) {
 myStream.getVideoTracks()[0].enabled = false;
// mute_btn.classList.toggle("background__red");
$("#videoButton").html('<i class="fas fa-video-slash"></i>');
} else {
 myStream.getVideoTracks()[0].enabled = true;
//mute_btn.classList.toggle("background__red");
 $("#videoButton").html('<i class="fas fa-video"></i>');
}
   });

// for leave button
$("#leavebtn").on("click",function(userId){
    if (friends[userId]) friends[userId].close();
    document.querySelector("#leavebtn").classList.toggle("background__red");
});

// for messages
let input=document.querySelector("#chat_message");
$("#send").on("click",function(event){
  socket.emit("message",input.value);
  input.value=" ";
});
// if other server receive the messages
let messages=document.querySelector(".messages");

socket.on('send_message', function(message,userName) {

  messages.innerHTML =
    messages.innerHTML+ `<div class="message">
      <b><i class="far fa-user-circle"></i> <span>${
    userName

      }
      </span></b>
      <span>${message}</span>
      </div>`

});
