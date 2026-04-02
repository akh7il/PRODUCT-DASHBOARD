import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Purchasesuccess.css'


export default function PurchaseSuccess() {
  const navigate = useNavigate()
  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon">
          ✓
        </div>
        <h1 className="success-title">
          Order Placed Successfully
        </h1>
        <p className="success-subtitle">
          Your order has been confirmed and will be delivered soon.
        </p>
        <div className="success-info">
          <p>Payment Method: <span>Cash on Delivery</span></p>
          <p>Status: <span>Processing</span></p>
        </div>
        <div className="success-actions">
          <button
            className="btn primary"
            onClick={() => navigate('/user')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}