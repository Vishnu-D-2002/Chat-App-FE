import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import UserList from "./UserList";
import ScrollToBottom from "react-scroll-to-bottom";
import moment from "moment";
import "../App.css";
import Navlink from "./Navbar/Navbar";
import { FaArrowLeft, FaTelegramPlane } from "react-icons/fa";

const socket = io.connect("https://chat-app-be-78gg.onrender.com/");

const Chat = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageHistory, setMessageHistory] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [showChat, setShowChat] = useState(false);
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
        const senderId = message.sender;
        const receiverId = message.receiver;
        setMessageHistory((prevMessageHistory) => {
          const key =
            senderId < receiverId
              ? `${senderId}-${receiverId}`
              : `${receiverId}-${senderId}`;
          const updatedHistory = { ...prevMessageHistory };
          updatedHistory[key] = [...(updatedHistory[key] || []), message];
          return updatedHistory;
        });
      });
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (currentUser && selectedUser) {
          const key =
            currentUser < selectedUser._id
              ? `${currentUser}-${selectedUser._id}`
              : `${selectedUser._id}-${currentUser}`;
          const response = await axios.get(
            `https://chat-app-be-78gg.onrender.com/msg/${currentUser}/${selectedUser._id}`
          );
          setMessageHistory((prevMessageHistory) => ({
            ...prevMessageHistory,
            [key]: response.data,
          }));
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [currentUser, selectedUser]);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setShowChat(true);
    setNewMessage("");
    scrollToBottom();
  };

  const sendMessage = () => {
    if (newMessage.trim() !== "" && currentUser && selectedUser) {
      const newMessageObj = {
        sender: currentUser,
        receiver: selectedUser._id,
        message: newMessage,
        createdAt: new Date().toISOString(),
      };
      const key =
        currentUser < selectedUser._id
          ? `${currentUser}-${selectedUser._id}`
          : `${selectedUser._id}-${currentUser}`;
      setMessageHistory((prevMessageHistory) => ({
        ...prevMessageHistory,
        [key]: [...(prevMessageHistory[key] || []), newMessageObj],
      }));
      socket.emit("sendMessage", newMessageObj);
      setNewMessage("");
      inputRef.current.focus();
      scrollToBottom();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageHistory, selectedUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const renderTimeAgo = (createdAt) => {
    const diffInSeconds = moment().diff(moment(createdAt), "seconds");
    if (diffInSeconds < 60) {
      return "just now";
    } else {
      return moment(createdAt).fromNow();
    }
  };

  const handleBackClick = () => {
    setSelectedUser(null);
    setShowChat(false);
  };

  return (
    <div className="container bg-dark-subtle">
      <Navlink />
      <div className="row">
        {showChat && (
          <div className="col-12 d-sm-none">
            <button className="btn" onClick={handleBackClick}>
              <FaArrowLeft />
            </button>
          </div>
        )}
        <div
          className={`col-lg-4 col-sm-4 ${showChat ? "d-none d-sm-block" : ""}`}
        >
          <UserList onSelectUser={handleUserSelect} />
        </div>
        <div
          className={`col-lg-8 col-sm-8 ${showChat ? "" : "d-none d-sm-block"}`}
          style={{
            borderLeft: "1px solid",
            borderTop: "0",
            borderRight: "0",
            borderBottom: "0",
          }}
        >
          <ScrollToBottom className="scroll-container">
            {selectedUser && (
              <div className="mt-3">
                <h2 className="mb-3 text-center ">{selectedUser.name}</h2>
                <div
                  className="chat-box"
                  style={{
                    minHeight: "500px",
                    maxHeight: "440px",
                    overflowY: "scroll",
                  }}
                >
                  {(
                    messageHistory[
                      currentUser < selectedUser._id
                        ? `${currentUser}-${selectedUser._id}`
                        : `${selectedUser._id}-${currentUser}`
                    ] || []
                  ).map((message) => (
                    <div
                      key={message._id}
                      className={
                        message.sender === currentUser ||
                        message.sender._id === currentUser
                          ? "sent mt-2 mb-2"
                          : "received mt-2 mb-2"
                      }
                    >
                      <div className="message-content d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          {message.message}
                        </div>
                        <br />
                        <div className="text-end">
                          <sub>{renderTimeAgo(message.createdAt)}</sub>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="input-group mt-3 mb-3">
                  <input
                    type="text"
                    style={{ border: "3px solid" }}
                    className="form-control"
                    value={newMessage}
                    ref={inputRef}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-primary fs-4"
                      type="button"
                      onClick={sendMessage}
                    >
                      <FaTelegramPlane />
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
