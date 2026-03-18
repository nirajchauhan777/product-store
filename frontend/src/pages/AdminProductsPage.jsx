import { useEffect, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../services/productService";
import "../styles/AdminProductsPage.css";



export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const res = await getProducts();
    setProducts(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
    });

    setImageFile(null);
    setImagePreview("");
    setEditing(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      image: imageFile || imagePreview,
    };

    if (editing) {
      await updateProduct(editing._id, payload);
    } else {
      await createProduct(payload);
    }

    load();
    resetForm();
  };

  const handleEdit = (product) => {
    setEditing(product);

    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
    });

    setImagePreview(product.image);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await deleteProduct(id);
    load();
  };

  return (
    <div className="admin-products">

      <h1 className="page-title">Product Management</h1>

      {/* FORM */}
      <div className="product-form-card">

        <h2>{editing ? "Edit Product" : "Add Product"}</h2>

        <form onSubmit={handleSubmit} className="product-form">

          <input
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
          />

          <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) =>
              setForm({ ...form, stock: Number(e.target.value) })
            }
          />

          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          />

          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setImageFile(file);
              setImagePreview(URL.createObjectURL(file));
            }}
          />

          {imagePreview && (
            <img className="preview-img" src={imagePreview} alt="" />
          )}

          <div className="form-buttons">

            <button className="btn primary">
              {editing ? "Update Product" : "Add Product"}
            </button>

            {editing && (
              <button
                type="button"
                className="btn cancel"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}

          </div>
        </form>
      </div>

      {/* PRODUCT LIST */}

      <div className="products-grid">

        {products.map((p) => (
          <div key={p._id} className="product-card">

            <img src={p.image} alt="" />

            <h3>{p.name}</h3>

            <p className="price">₹{p.price}</p>

            <p className="desc">{p.description}</p>

            <div className="card-buttons">

              <button
                className="btn edit"
                onClick={() => handleEdit(p)}
              >
                Edit
              </button>

              <button
                className="btn delete"
                onClick={() => handleDelete(p._id)}
              >
                Delete
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}