import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import UserList from "./UserList";
import ScrollToBottom from "react-scroll-to-bottom";
import TimeAgo from "react-timeago"; // Import TimeAgo component
import moment from "moment";

const socket = io.connect("http://localhost:3000");

const Chat = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef();

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
      const newMessageObj = {
        sender: currentUser,
        receiver: selectedUser._id,
        message: newMessage,
        createdAt: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, newMessageObj]);
      socket.emit("sendMessage", newMessageObj);
      setNewMessage("");
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="container bg-dark-subtle">
      <h1 className="mt-4">Chat Application</h1>
      <div className="row">
        <div className="col-lg-4 col-sm-4">
          <UserList onSelectUser={handleUserSelect} />
        </div>
        <div className="col-lg-8 col-sm-8">
          <ScrollToBottom className="scroll-container">
            {selectedUser && (
              <div>
                <h2>Chat with {selectedUser.name}</h2>
                <div
                  className="chat-box"
                  style={{ maxHeight: "440px", overflowY: "scroll" }}
                >
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={
                        message.sender === currentUser ? "sent" : "received"
                      }
                    >
                      <div className="message-content">
                        <strong>{message.sender.name}:</strong>{" "}
                        {message.message}
                        <sub>
                          <TimeAgo date={moment(message.createdAt)} />
                        </sub>{" "}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="input-group mt-3 mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={newMessage}
                    ref={inputRef}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-primary fs-4"
                      type="button"
                      onClick={sendMessage}
                    >
                      ⩥
                    </button>
                  </div>
                </div>
              </div>
            )}
          </ScrollToBottom>
        </div>
      </div>
    </div>
  );
};

export default Chat;
