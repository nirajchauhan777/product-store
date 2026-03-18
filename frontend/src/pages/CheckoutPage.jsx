import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/orderService';

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      await createOrder({});
      setSuccess('Order placed successfully!');
      setTimeout(() => navigate('/orders'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 600 }}>
      <h1>Checkout</h1>

      <p>
        This checkout page uses your cart items to create an order. Add products to your cart and proceed.
      </p>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <button onClick={handleCheckout} disabled={loading}>
        {loading ? 'Placing order…' : 'Place Order'}
      </button>
    </div>
  );
}
