import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import UserList from "./UserList";

const socket = io.connect("http://localhost:3000");

const Chat = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = sessionStorage.getItem("User");
        if (user) {
          setCurrentUser(JSON.parse(user).user._id);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.emit("join", currentUser);

      socket.on("message", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (currentUser && selectedUser) {
          const response = await axios.get(
            `http://localhost:3000/msg/${currentUser}/${selectedUser._id}`
          );
          setMessages(response.data);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [currentUser, selectedUser]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setMessages([]);
  };

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      socket.emit("sendMessage", {
        sender: currentUser,
        receiver: selectedUser._id,
        message: newMessage,
      });
      setNewMessage("");
    }
  };

  return (
    <div>
      <h1>Chat Application</h1>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          <UserList users={currentUser} onSelectUser={handleUserSelect} />
        </div>
        <div style={{ flex: 3 }}>
          {selectedUser && (
            <div>
              <h2>Chat with {selectedUser.name}</h2>
              <div style={{ height: "300px", overflowY: "scroll" }}>
                {messages.map((message) => (
                  <div key={message._id}>
                    <strong>{message.sender.name}:</strong> {message.message}
                  </div>
                ))}
              </div>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
