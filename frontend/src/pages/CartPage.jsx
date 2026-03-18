import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchCart, removeFromCart } from "../services/cartService";
import "../styles/CartPage.css";

export default function CartPage() {

  const [cart, setCart] = useState({ products: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadCart = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetchCart();
      setCart(res.data || { products: [] });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      loadCart();
    } catch (err) {
      console.error(err);
    }
  };

  const total = cart.products.reduce(
    (sum, item) =>
      sum + item.quantity * (item.product?.price || 0),
    0
  );

  return (
    <div className="container">

      <h1>Your Cart</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {cart.products.length === 0 ? (
        <p>
          Your cart is empty. <Link to="/">Browse products</Link>
        </p>
      ) : (
        <>
          <div className="cart-list">

            {cart.products.map((item, index) => {

              const product = item.product;

              if (!product) return null;

              return (
                <div className="cart-card" key={product._id || index}>

                  <img
                    src={product.image || "/no-image.png"}
                    alt={product.name}
                    className="cart-img"
                  />

                  <div className="cart-info">

                    <h3>{product.name}</h3>

                    <p>Price: ${product.price?.toFixed(2)}</p>

                    <p>Qty: {item.quantity}</p>

                    <p className="subtotal">
                      ${(product.price * item.quantity).toFixed(2)}
                    </p>

                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(product._id)}
                  >
                    Remove
                  </button>

                </div>
              );
            })}

          </div>

          <div className="cart-total">

            <strong>Total: ${total.toFixed(2)}</strong>

            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to checkout
            </button>

          </div>
        </>
      )}

    </div>
  );
}