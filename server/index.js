// This acts as the entry point to our server which will have only one single file in the server side
//Here we configure socket.io with express

// We start by creating a variable express using the const keyword which requires the downloaded module express
const express = require("express");
// We then create a variable app using the const keyword which acts as an instance of the express variable
const app = express();
// We then create http variable from the http module which is required to build our server together with socket io
const http = require("http");
// We then create cors variable from the cors module coz socket io deals with a lot of cors issues/bugs hence cors library helps in resolving those issues/problems with your connections
const cors = require("cors");

// We now import the class Server from the socket io library using the curly braces coz it exists inside the socket io library
const { Server } = require("socket.io");

// We initialize the app by using the cors middleware
app.use(cors());

// We create a server variable which will be using the http library with the help of the createServer() function thru passing the express app hence generating the server for us
const server = http.createServer(app);

// We now instantiate the Server using a variable called the io which establishes a connection by creating a new instance of the server class we just imported from socket io by passing the server we just created for connection purposes as the first argument and an object as the second argument which will take in cors as the key and values as some of the credentials
const io = new Server(server, {
  cors: {
    //origin signifies which server (react server) will be making the call to our socket io server hence connecting it to our frontend
    origin: "http://localhost:3000",
    //method specifies the methods the server will be accepting
    methods: ["GET", "POST"],
  },
});

// We call the io variable so as to detect if someone connected to the socket io server using the connection event, which enacts a callback function which grabs an actual socket 
io.on("connection", (socket) => {
  // When someone is connected we display the msg with a random socket ID
  console.log(`User Connected: ${socket.id}`);

  // We emit an event from socket io from our front end by creating an event from socket io which determines when someone wants to join a room
  socket.on("join_room", (data) => {
    // We join a room based on the id they entered in the front end as data
    socket.join(data);//This data is actually some id
    // After joining the room we display in the terminal the user ID and ID of the room joined as data which we grabbed from the frontend
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  // Here we create an event send_message which accepts data with a callback function which handles the sending of the data which is the messageData content from the chat.js
  socket.on("send_message", (data) => {
    // we then send the msg a user send to another user thru emiting from a backend to the receive_message event to whoever is in that room thru specifying the id of the room
    socket.to(data.room).emit("receive_message", data);
  });
  

  // At the end of our connection we add a disconnect event with a callback function which runs when someone tries to disconnect with their socket ID
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});


// We set the server to listen on port 3001 coz react will be running on port 3000 as the first argument, then pass the call back function whenever the server runs it prints a message on the console as the second argument
// To run both the client & the node server, cd to the package.json directory in the server folder and run 'npm run dev'
server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
