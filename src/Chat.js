// This chat component is where we are going to be sending msgs & receiving msgs thru socket io
import React, { useEffect, useState } from "react";
// This enables us to easily scroll down whenever we have received/read a message & its from react-scroll-to-bottom library
import ScrollToBottom from "react-scroll-to-bottom";

// Here we pass the socket, username & room variables as props to our Chat components so as to keep track of the socket, username & chat room
function Chat({ socket, username, room }) {
  // currentMessage variable keeps track of the current message while setCurrentMessage mutates our state as a string
  const [currentMessage, setCurrentMessage] = useState("");
  // To show chats on the chat window we create a state inside our chat which represents the list of messages coming into your chat as an empty array 
  const [messageList, setMessageList] = useState([]);

  // Here we create an asyncronous function which will be called when we click on the send message button in the chat window, asyncronous waits for the message to be sent so as to update our array
  const sendMessage = async () => {
    // This logic allows us send messages thru our socket server
    if (currentMessage !== "") { //We check if the current message is empty if not we continue & send the message
      // The messageData object which will later be sent to the socket server includes the chat room, username, actual message and the time the message was sent
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      // We then emit a socket msg then send the messageData thru it thru creating a socket io event on the server side in index.js
      await socket.emit("send_message", messageData);
      // if we receive a msg from someone else not only do they see the msg but we also see the msg when we emit our own msg by setting the messageList by grabbing the current state of the message & turning it into the same list as b4 but at the end we add the new msg that we received as the messageData
      setMessageList((list) => [...list, messageData]);
      // Whenever you send a message & u want the input to be clear, u set the value to be equal to the currentMessage state, hence you have full control over the actual value of the input if we change the state thats why we set the actual value to an empty string everytime we send a message
      setCurrentMessage("");
    }
  };

  // useEffect is a code which is used to listen whenever there is any changes to our socket by calling the function inside of here whenever there is a change in our socket server
  useEffect(() => {
    // socket.on() means we wanna litsen to an event which is receive_message with a callback function setMessageList which determines want we will do whenever we receive this msg
    socket.on("receive_message", (data) => {
      // Whenever we receive a new message we set a messageList by grabbing the current state of the message & turning it into the same list as b4 but at the end we add the new msg that we received as data
      setMessageList((list) => [...list, data]);
    });
    //This clean up function is used to prevent the messages being displayed twice when receiving a new message where the sender will just see a single message but the receiver will see two messages
    return () => socket.removeListener('receive_message');
  }, [socket]);


  /* Awesome tutorial as always!! very clear and elaborated! 
    However, when I tested my app, there was an issue that when. I send a message, and the message is displayed twice. The solution is :
    in the useEffect() hook, we have to write the cleanup function below:
    return () => socket.removeListener('receive_message')
    It will fix the problem.
  */

  // UI for the chat goes here
  return (
    <div className="chat-window">
      {/* This div contains the chat header */}
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      {/* This div contains the chat body */}
      <div className="chat-body">
        {/* To use react-scroll-to-bottom library you have to wrap a component with the library, setting a specific height that you want by giving it a css with a className ie message-container */}
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              // This is where we display the msgs of the chat hence its the UI for the message body
              // So as to differentiate the msgs from different users and arrange them on the left & right of the chat window we have to identify who sent which messages by id, so if the username currently in the chat is equal to the username from the message its 'you' or else its the 'other' user which can be accessed in the css by ids
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  {/* content contains the actual msg */}
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  {/* meta of the message contains the time the msg was sent & username of the message */}
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
              
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      {/* This div contains the chat footer */}
      <div className="chat-footer">
        {/* This is where we write the msgs of the chat*/}
        {/* Whenever this input changes we set the value of the message to the currentMessage while we setCurrentMessage to be equal to the event.target.value  */}
        <input
          type="text"
          value={currentMessage}
          placeholder="Write something..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          // This enables both the button on the chat & enter on the keyboard both works by sending the message by grabbing the event which clarifyies if the key pressed is Enter we call the sendMessage() function
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
          
        />
        {/* This is where we send the msgs by calling the sendMessage function upon clicking on the button*/}
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

// To run the react client, cd to the package.json directory in the client folder and run 'npm start'
export default Chat;


