import React, { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "http://(localhost):5005/api";

const s = {
  header: { background: "#2c3e50", color: "#fff", padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  cartBtn: { background: "#e67e22", color: "#fff", border: "none", padding: "8px 18px", borderRadius: 4, fontWeight: "bold" },
  container: { maxWidth: 1100, margin: "0 auto", padding: "30px 20px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 },
  card: { background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: 20, display: "flex", flexDirection: "column" },
  price: { color: "#e67e22", fontWeight: "bold", fontSize: 20, margin: "8px 0" },
  addBtn: { background: "#2c3e50", color: "#fff", border: "none", padding: "8px 0", borderRadius: 4, marginTop: "auto" },
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 100 },
  modal: { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "#fff", padding: 30, borderRadius: 8, width: 460, maxHeight: "85vh", overflowY: "auto", zIndex: 101 },
  input: { width: "100%", padding: "9px 12px", marginBottom: 12, border: "1px solid #ccc", borderRadius: 4, fontSize: 14 },
  placeBtn: { background: "#27ae60", color: "#fff", border: "none", padding: "10px 0", width: "100%", borderRadius: 4, fontSize: 15, fontWeight: "bold" },
  tag: { background: "#ecf0f1", padding: "2px 8px", borderRadius: 10, fontSize: 12, display: "inline-block", marginBottom: 6 },
  filterBar: { display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" },
  filterBtn: { padding: "6px 16px", border: "1px solid #ccc", borderRadius: 20, background: "#fff", cursor: "pointer" },
  filterBtnActive: { padding: "6px 16px", border: "1px solid #2c3e50", borderRadius: 20, background: "#2c3e50", color: "#fff", cursor: "pointer" },
};

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [category, setCategory] = useState("All");
  const [form, setForm] = useState({ customerName: "", customerEmail: "" });
  const [orderDone, setOrderDone] = useState(false);

  useEffect(() => {
    axios.get(`${API}/products`).then(r => setProducts(r.data)).catch(console.error);
  }, []);

  const categories = ["All", ...new Set(products.map(p => p.category))];
  const filtered = category === "All" ? products : products.filter(p => p.category === category);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === product._id);
      if (existing) return prev.map(i => i._id === product._id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(cart.filter(i => i._id !== id));
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const placeOrder = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/orders`, {
        ...form,
        items: cart.map(i => ({ productId: i._id, name: i.name, price: i.price, quantity: i.qty })),
        total,
      });
      setCart([]);
      setOrderDone(true);
      setShowCheckout(false);
    } catch {
      alert("Order failed. Please try again.");
    }
  };

  return (
    <div>
      <div style={s.header}>
        <h1 style={{ fontSize: 24 }}>🛒 ShopNow</h1>
        <button style={s.cartBtn} onClick={() => setShowCart(true)}>
          Cart ({cartCount}) — ₹{total}
        </button>
      </div>

      <div style={s.container}>
        {orderDone && (
          <div style={{ background: "#d5f5e3", border: "1px solid #27ae60", borderRadius: 8, padding: 16, marginBottom: 20, color: "#1e8449" }}>
            ✅ Order placed successfully! Thank you for shopping.
            <button style={{ marginLeft: 16, background: "none", border: "none", color: "#1e8449", cursor: "pointer", fontWeight: "bold" }} onClick={() => setOrderDone(false)}>Dismiss</button>
          </div>
        )}

        <div style={s.filterBar}>
          {categories.map(c => (
            <button key={c} style={c === category ? s.filterBtnActive : s.filterBtn} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>

        <div style={s.grid}>
          {filtered.map(p => (
            <div key={p._id} style={s.card}>
              <span style={s.tag}>{p.category}</span>
              <h3 style={{ marginBottom: 4 }}>{p.name}</h3>
              <p style={{ fontSize: 13, color: "#777", marginBottom: 8 }}>{p.description}</p>
              <div style={s.price}>₹{p.price}</div>
              <p style={{ fontSize: 12, color: p.stock > 0 ? "#27ae60" : "#e74c3c", marginBottom: 10 }}>
                {p.stock > 0 ? `${p.stock} in stock` : "Out of Stock"}
              </p>
              <button style={{ ...s.addBtn, opacity: p.stock === 0 ? 0.5 : 1 }} disabled={p.stock === 0} onClick={() => addToCart(p)}>
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>

      {showCart && (
        <>
          <div style={s.overlay} onClick={() => setShowCart(false)} />
          <div style={s.modal}>
            <h2 style={{ marginBottom: 16 }}>🛒 Your Cart</h2>
            {cart.length === 0 ? <p style={{ color: "#888" }}>Your cart is empty.</p> : (
              <>
                {cart.map(i => (
                  <div key={i._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #eee" }}>
                    <div>
                      <strong>{i.name}</strong>
                      <p style={{ fontSize: 13, color: "#888" }}>₹{i.price} × {i.qty}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontWeight: "bold" }}>₹{i.price * i.qty}</span>
                      <button style={{ background: "#e74c3c", color: "#fff", border: "none", padding: "4px 8px", borderRadius: 4 }} onClick={() => removeFromCart(i._id)}>×</button>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong style={{ fontSize: 18 }}>Total: ₹{total}</strong>
                  <button style={{ background: "#27ae60", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 4, fontWeight: "bold" }}
                    onClick={() => { setShowCart(false); setShowCheckout(true); }}>
                    Checkout
                  </button>
                </div>
              </>
            )}
            <button style={{ marginTop: 16, width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 4, background: "#fff" }} onClick={() => setShowCart(false)}>Close</button>
          </div>
        </>
      )}

      {showCheckout && (
        <>
          <div style={s.overlay} onClick={() => setShowCheckout(false)} />
          <div style={s.modal}>
            <h2 style={{ marginBottom: 16 }}>Checkout</h2>
            <form onSubmit={placeOrder}>
              <input style={s.input} placeholder="Your Name" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} required />
              <input style={s.input} type="email" placeholder="Email Address" value={form.customerEmail} onChange={e => setForm({ ...form, customerEmail: e.target.value })} required />
              <div style={{ background: "#f8f9fa", padding: 12, borderRadius: 4, marginBottom: 16 }}>
                {cart.map(i => (
                  <div key={i._id} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 4 }}>
                    <span>{i.name} × {i.qty}</span><span>₹{i.price * i.qty}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px solid #ddd", paddingTop: 8, marginTop: 8, fontWeight: "bold", display: "flex", justifyContent: "space-between" }}>
                  <span>Total</span><span>₹{total}</span>
                </div>
              </div>
              <button style={s.placeBtn} type="submit">Place Order (Simulated)</button>
            </form>
            <button style={{ marginTop: 12, width: "100%", padding: 10, border: "1px solid #ccc", borderRadius: 4, background: "#fff" }} onClick={() => setShowCheckout(false)}>Cancel</button>
          </div>
        </>
      )}
    </div>
  );
}
