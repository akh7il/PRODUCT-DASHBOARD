import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import "../styles/Navbar.css"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [initials, setInitials] = useState("A")
  useEffect(() => {
    fetchCartCount()
    getInitials()
    const interval = setInterval(() => {
      fetchCartCount()
    }, 50)
    return () => clearInterval(interval)
  }, [])
  const fetchCartCount = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/cart/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`
        }
      })
      const data = await response.json()
      if (response.ok && data.length > 0) {
        const items = data[0].items || []
        const total = items.reduce((sum, item) => sum + item.quantity, 0)
        setCartCount(total)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const getInitials = () => {
    const name = localStorage.getItem("user_name") || "User"
    const parts = name.split(" ")
    let result = parts[0][0]
    if (parts.length > 1) {
      result += parts[1][0]
    } else if (parts[0].length > 1) {
      result += parts[0][1]
    }
    setInitials(result.toUpperCase())
  }
  return (
    <div className='navbar-container'>
      <div className='navbar-container-brand'>
        <p className='navbar-brand-name'>ProductDashboard</p>
      </div>
      <div className={`navbar-container-options ${open ? "active" : ""}`}>
        <Link to="cart" className='nav-link cart-link'>
          <span className='cart-icon'>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
              <path d="M223.5-103.5Q200-127 200-160t23.5-56.5Q247-240 280-240t56.5 23.5Q360-193 360-160t-23.5 56.5Q313-80 280-80t-56.5-23.5Zm400 0Q600-127 600-160t23.5-56.5Q647-240 680-240t56.5 23.5Q760-193 760-160t-23.5 56.5Q713-80 680-80t-56.5-23.5ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" />
            </svg>
          </span>
          cart
          {cartCount > 0 && (
            <span className='cart-badge'>{cartCount}</span>
          )}
        </Link>
        <div className='profile-avatar'>{initials}</div>
      </div>
      <div className='menu-icon' onClick={() => setOpen(!open)}>
        ☰
      </div>
    </div>
  )
}