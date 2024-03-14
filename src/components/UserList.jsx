import React, { useEffect, useState } from "react";
import axios from "axios";
import OtherUsers from "./OtherUsers";

const UserList = ({ onSelectUser }) => {
  const [usersWithMessages, setUsersWithMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUsersWithMessages = async () => {
      try {
        let user = JSON.parse(sessionStorage.getItem("User"));
        let userId = user.user._id;
        const response = await axios.get(
          `https://chat-app-be-78gg.onrender.com/users/with-messages/${userId}`
        );
        setUsersWithMessages(response.data.usersWithMessages);
      } catch (error) {
        console.error("Error fetching users with messages:", error);
      }
    };

    fetchUsersWithMessages();
  }, []);

  useEffect(() => {
    setFilteredUsers(
      usersWithMessages.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, usersWithMessages]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="container">
      <OtherUsers onSelectUser={onSelectUser} />
      <h2 className="mt-4 mb-3">ChatedUsers</h2>
      <input
        type="text"
        style={{ border: "3px solid" }}
        className="form-control mb-3"
        placeholder="Search chated users..."
        value={searchTerm}
        onChange={handleInputChange}
      />
      <ul
        className="list-group mb-3"
        style={{ maxHeight: "200px", overflowY: "scroll" }}
      >
        {filteredUsers.map((user) => (
          <li
            key={user._id}
            className="list-group-item list-group-item-action"
            onClick={() => onSelectUser(user)}
          >
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
