import { useEffect, useMemo, useState } from 'react';
import { getProducts } from '../services/productService';
import {
  getAdminCarts,
  getAdminCart,
  adminAddToCart,
  adminRemoveFromCart,
} from '../services/cartService';

const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

export default function AdminCartsPage() {
  const [carts, setCarts] = useState([]);
  const [selectedCartId, setSelectedCartId] = useState(null);
  const [selectedCart, setSelectedCart] = useState(null);
  const [products, setProducts] = useState([]);
  const [addProductId, setAddProductId] = useState('');
  const [addQuantity, setAddQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalItems = useMemo(() => {
    if (!selectedCart) return 0;
    return selectedCart.products.reduce((sum, item) => sum + item.quantity, 0);
  }, [selectedCart]);

  const totalValue = useMemo(() => {
    if (!selectedCart) return 0;
    return selectedCart.products.reduce((sum, item) => sum + item.quantity * (item.product?.price || 0), 0);
  }, [selectedCart]);

  const fetchCarts = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getAdminCarts();
      setCarts(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartDetails = async (cartId) => {
    setLoading(true);
    setError(null);

    try {
      const res = await getAdminCart(cartId);
      setSelectedCart(res.data);
      setSelectedCartId(cartId);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCart = (cartId) => {
    if (cartId === selectedCartId) {
      setSelectedCartId(null);
      setSelectedCart(null);
      return;
    }
    fetchCartDetails(cartId);
  };

  const handleAddProduct = async () => {
    if (!selectedCartId || !addProductId || addQuantity < 1) return;

    setLoading(true);
    setError(null);

    try {
      await adminAddToCart(selectedCartId, addProductId, Number(addQuantity));
      await fetchCarts();
      await fetchCartDetails(selectedCartId);
      setAddQuantity(1);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    if (!selectedCartId) return;

    setLoading(true);
    setError(null);

    try {
      await adminRemoveFromCart(selectedCartId, productId);
      await fetchCarts();
      await fetchCartDetails(selectedCartId);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarts();
    getProducts()
      .then((res) => setProducts(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="container">
      <h1>Cart Management</h1>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {carts.map((cart) => {
          const subtotal = cart.products.reduce(
            (sum, item) => sum + item.quantity * (item.product?.price || 0),
            0
          );

          return (
            <div
              key={cart._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: 12,
                padding: 16,
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                cursor: 'pointer',
              }}
              onClick={() => handleSelectCart(cart._id)}
            >
              <h2 style={{ margin: '0 0 8px', fontSize: 18 }}>{cart.userId?.name || 'Unknown user'}</h2>
              <p style={{ margin: 0, opacity: 0.8 }}>{cart.userId?.email}</p>
              <p style={{ margin: '12px 0 0', fontSize: 14, opacity: 0.8 }}>
                Items: {cart.products.length} • Quantity: {cart.products.reduce((sum, item) => sum + item.quantity, 0)}
              </p>
              <p style={{ margin: '4px 0 0', fontWeight: 600 }}>{formatCurrency(subtotal)}</p>
              <div style={{ marginTop: 12, fontSize: 13, color: '#555' }}>
                {selectedCartId === cart._id ? 'Click again to collapse' : 'Click to manage this cart'}
              </div>
            </div>
          );
        })}
      </div>

      {selectedCart && (
        <section style={{ marginTop: 32, padding: 24, border: '1px solid #ddd', borderRadius: 12, background: '#fff' }}>
          <h2 style={{ marginBottom: 12 }}>Cart Details</h2>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 16 }}>
            <div>
              <strong>User</strong>
              <div>{selectedCart.userId?.name}</div>
              <div style={{ opacity: 0.7 }}>{selectedCart.userId?.email}</div>
            </div>
            <div>
              <strong>Summary</strong>
              <div>Items: {selectedCart.products.length}</div>
              <div>Quantity: {totalItems}</div>
              <div>Total: {formatCurrency(totalValue)}</div>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <h3 style={{ margin: '0 0 8px' }}>Add product</h3>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <select
                value={addProductId}
                onChange={(e) => setAddProductId(e.target.value)}
                style={{ padding: 8, flex: '1 0 220px' }}
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} — {formatCurrency(product.price)}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                value={addQuantity}
                onChange={(e) => setAddQuantity(Number(e.target.value))}
                style={{ width: 96, padding: 8 }}
              />
              <button
                onClick={handleAddProduct}
                style={{ padding: '10px 16px', background: '#222', color: '#fff', border: 'none', borderRadius: 6 }}
              >
                Add
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th align="left" style={{ padding: 12, borderBottom: '1px solid #ddd' }}>
                    Product
                  </th>
                  <th align="right" style={{ padding: 12, borderBottom: '1px solid #ddd' }}>
                    Price
                  </th>
                  <th align="right" style={{ padding: 12, borderBottom: '1px solid #ddd' }}>
                    Qty
                  </th>
                  <th align="right" style={{ padding: 12, borderBottom: '1px solid #ddd' }}>
                    Subtotal
                  </th>
                  <th align="center" style={{ padding: 12, borderBottom: '1px solid #ddd' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedCart.products.map((item) => (
                  <tr key={item.product?._id ?? item.product} style={{ borderTop: '1px solid #eee' }}>
                    <td style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                      {item.product?.image && (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }}
                        />
                      )}
                      <div>
                        <div style={{ fontWeight: 600 }}>{item.product?.name}</div>
                        <div style={{ fontSize: 12, opacity: 0.85 }}>{item.product?.category || ''}</div>
                      </div>
                    </td>
                    <td align="right" style={{ padding: 12 }}>
                      {formatCurrency(item.product?.price || 0)}
                    </td>
                    <td align="right" style={{ padding: 12 }}>{item.quantity}</td>
                    <td align="right" style={{ padding: 12 }}>
                      {formatCurrency((item.product?.price || 0) * item.quantity)}
                    </td>
                    <td align="center" style={{ padding: 12 }}>
                      <button
                        onClick={() => handleRemoveItem(item.product?._id)}
                        style={{ padding: '6px 12px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: 6 }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
