import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProduct } from '../services/productService';
import { addToCart } from '../services/cartService';
import { useAuth } from '../context/AuthContext';
import "../styles/ProductPage.css"; 

export default function ProductPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    setLoading(true);
    getProduct(id)
      .then((res) => setProduct(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setSuccess(null);
      await addToCart(product._id, quantity);
      setSuccess('Added to cart.');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <div className="container">Loading…</div>;
  if (error) return <div className="container">Error: {error}</div>;
  if (!product) return null;

 return (
  <div className="product-container">

    <div className="product-grid">

      <div className="product-image">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
          />
        )}
      </div>

      <div className="product-info">
        <h1>{product.name}</h1>

        <p className="description">{product.description}</p>

        <p className="price">${product.price.toFixed(2)}</p>

        <p className="stock">Stock: {product.stock}</p>

        <div className="cart-controls">
          <input
            type="number"
            min={1}
            max={product.stock || 99}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />

          <button
            onClick={handleAddToCart}
            disabled={!product.stock}
          >
            Add to cart
          </button>
        </div>

        {success && <p className="success">{success}</p>}

      </div>

    </div>

  </div>
) };