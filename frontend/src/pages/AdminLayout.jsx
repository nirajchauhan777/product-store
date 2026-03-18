import { Link, Outlet } from "react-router-dom";


export default function AdminLayout() {
  return (
    <div className="admin-layout">

      {/* Sidebar */}
      <aside className="admin-sidebar">

        <h2>Admin Panel</h2>

        <nav className="sidebar-menu">
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/products">Manage Products</Link>
          <Link to="/admin/users">Manage Users</Link>
          <Link to="/admin/orders">View Orders</Link>
          <Link to="/admin/carts">View Carts</Link>
        </nav>

        <button className="logout-btn">Logout</button>

      </aside>

      {/* Page Content */}
      <main className="admin-content">
        <Outlet />
      </main>

    </div>
  );
}