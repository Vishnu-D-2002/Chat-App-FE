import React, { useEffect, useState } from "react";
import axios from "axios";

const UserList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let user = JSON.parse(sessionStorage.getItem("User"));
        let userId = user.user._id;
        const response = await axios.get(
          `http://localhost:3000/users/${userId}`
        );
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="container ">
      <h2 className="mt-4 mb-3">Users</h2>
      <ul className="list-group">
        {users.map((user) => (
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
