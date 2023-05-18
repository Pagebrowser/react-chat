import "./App.css";
// Here we call an instance of io to establish a connection  from socket.io-client module
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";

// We then establish a connection outside a component mapped to the link where we are running our socket io server hence connecting it to our backend
const socket = io.connect("http://localhost:3001");

function App() {
  //We create variables for username, room & showChat which are going to be strings as first arguments & functions to mutate the variables as second arguments
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  // showChat boolean determines whether we wanna show the chat/not & it starts as false
  const [showChat, setShowChat] = useState(false);

  // This function joins the room whenever u click on the button
  const joinRoom = () => {
    // We can only join a room if the username exists & the room exists
    if (username !== "" && room !== "") {
      // We emit an event from socket io from our front end by creating an event from socket io which determines when someone wants to join a room by passing the name of the event and its corresponding data in this case the room id
      socket.emit("join_room", room);
      // After you join the room you change the boolean showChat to true using the state setShowChat
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {/* If showChat is equal to false u show the join chat window ":" If showChat is equal to true u show the actual chat window */}
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="Full Names..."
            // Onchange of event we set the username to access the value of input ie what is written at the moment
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            // Onchange of event we set the room to access the value of input ie what is written at the moment
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) 
      : //If showChat is equal to true u show the actual chat window
      (
        // Here we call our chat component as a tag & pass in our socket, username & chat room as props
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );

}

export default App;
