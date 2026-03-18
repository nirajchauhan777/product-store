import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/productService';
import '../styles/ProductsPage.css';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then((res) => setProducts(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))];
  const visibleProducts =
    category === 'All' ? products : products.filter((product) => product.category === category);

  if (loading) return <div className="container">Loading products…</div>;
  if (error) return <div className="container">Error: {error}</div>;

  return (
    <div className="container products-page">
      <h1>Products</h1>

      <div className="products-page__controls">
        <label>
          Category:
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="products-grid">
        {visibleProducts.map((product) => (
          <div key={product._id} className="product-card">
            {product.image && (
              <img src={product.image} alt={product.name} className="product-card__image" />
            )}

            <div className="product-card__body">
              <h2 className="product-card__title" title={product.name}>
                {product.name}
              </h2>
              <p className="product-card__description">{product.description}</p>

              <div className="product-card__footer">
                <span className="product-card__price">${product.price.toFixed(2)}</span>
                <Link to={`/products/${product._id}`} className="product-card__action">
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
