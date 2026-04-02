import React from 'react';
import '../styles/Productcard.css';

export default function ProductCard({ product }) {

  const addToCart = async () => {
    const token = localStorage.getItem("access");

    const cartRes = await fetch("http://127.0.0.1:8000/api/cart/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const cartData = await cartRes.json();
    const cartId = cartData[0].id;

    const response = await fetch(
      `http://127.0.0.1:8000/api/cart/${cartId}/add-item/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product: product.id,
          quantity: 1,
        }),
      }
    );
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img
          src={product.image}
          alt={product.title}
          style={{ width: "200px", height: "200px", objectFit: "cover" }}
        />
      </div>

      <div className="product-content">
        <h2 className="product-title">{product.title}</h2>

        <p className="product-description">
          {product.description}
        </p>

        <div className="product-footer">
          <span className="product-price">₹{product.price}</span>

          <button className="add-btn" onClick={addToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}