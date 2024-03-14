import React, { useEffect, useState } from "react";
import axios from "axios";

const OtherUsers = ({ onSelectUser }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
        try {
          const userId=JSON.parse(sessionStorage.getItem('User'))
        const response = await axios.get(
          `https://chat-app-be-78gg.onrender.com/users/${userId.user._id}`
        );
        setAllUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching all users:", error);
      }
    };

    fetchAllUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(
      allUsers.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, allUsers]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <h3  className="mt-2">All Users</h3>
      <input
        type="text"
        style={{ border: "3px solid" }}
        className="form-control mb-3"
        placeholder="Find users..."
        value={searchTerm}
        onChange={handleInputChange}
      />
      <ul className="list-group mb-3" style={{maxHeight:'200px',overflowY:'scroll'}}>
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

export default OtherUsers;
