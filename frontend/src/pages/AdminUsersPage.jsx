import { useEffect, useState } from "react";
import { getUsers } from "../services/authService";
import "../styles/AdminUsersPage.css";

export default function AdminUsersPage() {

  const [ users,setUsers] = useState([]);
  const [filteredUsers,setFilteredUsers] = useState([]);

  const [search,setSearch] = useState("");
  const [roleFilter,setRoleFilter] = useState("all");

  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);

  useEffect(()=>{
    setLoading(true);

    getUsers()
    .then(res=>{
      setUsers(res.data);
      setFilteredUsers(res.data);
    })
    .catch(err=>setError(err.response?.data?.message || err.message))
    .finally(()=>setLoading(false));

  },[]);


  useEffect(()=>{

    let result = users;

    if(search){   
      result = result.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if(roleFilter !== "all"){
      result = result.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(result);

  },[search,roleFilter,users]);



  return (

    <div className="admin-users">

      <h1 className="page-title">User Management</h1>

      {/* STATS */}

      <div className="stats">

        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{users.length}</p>
        </div>

        <div className="stat-card">
          <h3>Admins</h3>
          <p>{users.filter(u=>u.role==="admin").length}</p>
        </div>

        <div className="stat-card">
          <h3>Customers</h3>
          <p>{users.filter(u=>u.role==="user").length}</p>
        </div>

      </div>


      {/* FILTER */}

      <div className="filters">

        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />

        <select
          value={roleFilter}
          onChange={(e)=>setRoleFilter(e.target.value)}
        >

          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>

        </select>

      </div>



      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}



      <div className="table-card">

        <table>

          <thead>

            <tr>
              <th>Name</th> 
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>

          </thead>


          <tbody>

            {filteredUsers.map(user=>(
              <tr key={user._id}>

                <td>{user.name}</td>
                <td>{user.email}</td>

                <td>
                  <span className={`role ${user.role}`}>
                    {user.role}
                  </span>
                </td>

                <td>

                  <button className="edit-btn">
                    Edit
                  </button>

                  <button className="delete-btn">
                    Delete
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>

  );
}