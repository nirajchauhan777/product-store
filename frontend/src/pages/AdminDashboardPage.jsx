import "../styles/AdminDashboardPage.css";
import { Link } from "react-router-dom";
import DashboardGraf from "./DashboardGraf";

export default function AdminDashboardPage() {
  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard__header">
        <h1>Dashboard</h1>
        <p>Quick snapshot of your store performance and recent activity.</p>
      </header>

      <section className="admin-dashboard__quick">
        <h2>Quick actions</h2>
        <div className="quick-actions">
          <Link to="/admin/products" className="quick-action">
            Manage products
          </Link>
          <Link to="/admin/orders" className="quick-action">
            View orders
          </Link>
          <Link to="/admin/users" className="quick-action">
            Manage users
          </Link>
          <Link to="/admin/carts" className="quick-action">
            View carts
          </Link>
        </div>
      </section>

      <DashboardGraf />
    </div>
  );
}
