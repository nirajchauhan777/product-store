import { useEffect, useState } from 'react';
import { getOrders } from '../services/orderService';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getOrders()
      .then((res) => setOrders(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <h1>Order History</h1>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {orders.map((order) => (
            <div
              key={order._id}
              style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, background: '#fff' }}
            >
              <p>
                <strong>Order #</strong> {order._id}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Total:</strong> ${order.totalPrice.toFixed(2)}
              </p>
              <p>
                <strong>Created:</strong> {new Date(order.createdAt).toLocaleString()}
              </p>
              <ul>
                {order.products.map((item) => (
                  <li key={item.product?._id || item.product}>{item.product?.name || 'Unknown'} x {item.quantity}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
