import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Checkout.css'

export default function Checkout() {
  const [cart, setCart] = useState(null)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    pincode: '',
    district: '',
    state: ''
  })
  useEffect(() => {
    fetchCart()
  }, [])
  const fetchCart = async () => {
    const response = await fetch('http://127.0.0.1:8000/api/cart/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`
      }
    })
    if (response.status === 401) {
      localStorage.removeItem("access")
      navigate("/") 
      return
    }
    const data = await response.json()
    if (response.ok) {
      setCart(data[0])
    }
  }
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
  }
  const validateForm = () => {
    const newErrors = {}
    if (!form.first_name.trim()) {
      newErrors.first_name = 'First name is required'
    } else if (form.first_name.length < 2) {
      newErrors.first_name = 'First name must be at least 2 characters'
    }
    if (!form.last_name.trim()) {
      newErrors.last_name = 'Last name is required'
    } else if (form.last_name.length < 2) {
      newErrors.last_name = 'Last name must be at least 2 characters'
    }
    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits'
    }
    if (!form.address.trim()) {
      newErrors.address = 'Address is required'
    } else if (form.address.length < 5) {
      newErrors.address = 'Address must be at least 5 characters'
    }
    if (!form.pincode.trim()) {
      newErrors.pincode = 'Pincode is required'
    } else if (!/^\d{6}$/.test(form.pincode)) {
      newErrors.pincode = 'Pincode must be 6 digits'
    }
    if (!form.district.trim()) {
      newErrors.district = 'District is required'
    }
    if (!form.state.trim()) {
      newErrors.state = 'State is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const placeOrder = async () => {
    if (!validateForm()) {
      return
    }
    const response = await fetch('http://127.0.0.1:8000/api/orders/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("access")}`
      },
      body: JSON.stringify({
        ...form,
        cart_id: cart.id
      })
    })
    const data = await response.json()
    if (response.ok) {
      navigate('/user/cart/checkout/success')
    } else {
      console.log(data)
      alert('Order failed')
    }
  }
  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
  const totalPrice = cart?.items?.reduce(
    (sum, item) => sum + item.quantity * parseFloat(item.product.price),
    0
  ) || 0
  return (
    <div className="checkout-page">
      <div className="checkout-grid">
        <div className="form-section">
          <div className="section-title">
            <span className="step">1</span> Contact & Shipping
          </div>
          <div className="form-content">
            <div className="input-group">
              <label>First name</label>
              <input
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                className={errors.first_name ? 'error' : ''}
              />
              {errors.first_name && <span className="error-message">{errors.first_name}</span>}
            </div>
            <div className="input-group">
              <label>Last name</label>
              <input
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                className={errors.last_name ? 'error' : ''}
              />
              {errors.last_name && <span className="error-message">{errors.last_name}</span>}
            </div>
            <div className="input-group">
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            <div className="input-group">
              <label>Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
            <div className="input-group">
              <label>Address</label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className={errors.address ? 'error' : ''}
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>
            <div className="input-row">
              <div className="input-group">
                <label>Pincode</label>
                <input
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  className={errors.pincode ? 'error' : ''}
                />
                {errors.pincode && <span className="error-message">{errors.pincode}</span>}
              </div>
              <div className="input-group">
                <label>District</label>
                <input
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  className={errors.district ? 'error' : ''}
                />
                {errors.district && <span className="error-message">{errors.district}</span>}
              </div>
            </div>
            <div className="input-group">
              <label>State</label>
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                className={errors.state ? 'error' : ''}
              />
              {errors.state && <span className="error-message">{errors.state}</span>}
            </div>
            <div className="section-title" style={{ marginTop: '0.5rem' }}>
              <span className="step">2</span> Payment Method
            </div>
            <div className="payment-methods">
              <div className="payment-option active">
                Cash on Delivery
              </div>
            </div>
          </div>
        </div>
        <div className="order-summary">
          <div className="summary-title">YOUR ORDER</div>
          <div className="summary-content">
            {cart?.items?.map(item => (
              <div className="cart-item" key={item.id}>
                <div className="item-image">
                  <img src={item.product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="item-details">
                  <div className="item-name">{item.product.title}</div>
                  <div className="item-price">₹{item.product.price}</div>
                  <div className="item-quantity">Qty: {item.quantity}</div>
                </div>
                <div className="item-total">
                  ₹{item.quantity * item.product.price}
                </div>
              </div>
            ))}
            <div className="price-row">
              <span>Total items</span>
              <span>{totalItems}</span>
            </div>
            <div className="total-row">
              <span>TOTAL</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>
          <button className="checkout-btn" onClick={placeOrder}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  )
}