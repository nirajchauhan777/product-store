import { useEffect, useState } from "react";
import { getOrders } from "../services/orderService";
import "../styles/AdminOrdersPage.css";

export default function AdminOrdersPage() {

  const [orders,setOrders] = useState([]);
  const [filtered,setFiltered] = useState([]);

  const [search,setSearch] = useState("");
  const [statusFilter,setStatusFilter] = useState("all");

  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);

  useEffect(()=>{
    setLoading(true);

    getOrders()
      .then(res=>{
        setOrders(res.data);
        setFiltered(res.data);
      })
      .catch(err=>setError(err.response?.data?.message || err.message))
      .finally(()=>setLoading(false));

  },[]);


  useEffect(()=>{

    let result = orders;

    if(search){
      result = result.filter(o =>
        o._id.toLowerCase().includes(search.toLowerCase()) ||
        o.userId?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if(statusFilter !== "all"){
      result = result.filter(o => o.status === statusFilter);
    }

    setFiltered(result);

  },[search,statusFilter,orders]);


  return (

    <div className="admin-orders">

      <h1 className="page-title">Order Management</h1>


      {/* STATS */}

      <div className="stats">

        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{orders.length}</p>
        </div>

        <div className="stat-card">
          <h3>Pending</h3>
          <p>{orders.filter(o=>o.status==="pending").length}</p>
        </div>

        <div className="stat-card">
          <h3>Delivered</h3>
          <p>{orders.filter(o=>o.status==="delivered").length}</p>
        </div>

        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>
            ₹{
              orders.reduce((sum,o)=>sum + o.totalPrice,0)
            }
          </p>
        </div>

      </div>


      {/* FILTERS */}

      <div className="filters">

        <input
          placeholder="Search Order / User..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e)=>setStatusFilter(e.target.value)}
        >

          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>

        </select>

      </div>



      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}



      {filtered.length === 0 ? (

        <p>No Orders Found</p>

      ) : (

        <div className="orders-table">

          <table>

            <thead>

              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Status</th>
                <th>Total</th>
                <th>Date</th>
                <th>Items</th>
              </tr>

            </thead>


            <tbody>

              {filtered.map(order=>(

                <tr key={order._id}>

                  <td>{order._id.slice(-6)}</td>

                  <td>
                    {order.userId?.name}
                    <br/>
                    <small>{order.userId?.email}</small>
                  </td>

                  <td>
                    <span className={`status ${order.status}`}>
                      {order.status}
                    </span>
                  </td>

                  <td>₹{order.totalPrice}</td>

                  <td>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td>
                    {order.products.length}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}