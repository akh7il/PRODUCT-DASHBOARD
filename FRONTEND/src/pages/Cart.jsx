import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Cart.css'

export default function Cart() {
  const [cart, setCart] = useState(null)
  const navigate = useNavigate()
  useEffect(() => {
    fetchCart()
  }, [])
  const fetchCart = async () => {
    try {
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
      } else {
        console.log(data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const deleteItem = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/cart-items/${id}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`
        }
      })
      if (response.ok) {
        fetchCart()
      } else {
        console.log('Delete failed')
      }
    } catch (error) {
      console.log(error)
    }
  }
  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
  const totalPrice = cart?.items?.reduce(
    (sum, item) => sum + item.quantity * parseFloat(item.product.price),
    0
  ) || 0
  return (
    <div className='cart-container'>
      <div className='cart-container-left'>
        <h1 className='cart-container-head left'>shopping cart</h1>
        {cart?.items?.map(item => (
          <div className='cart-box' key={item.id}>
            <div className='cart-image'>
              <img src={item.product.image} alt={item.product.title} />
            </div>
            <div className='cart-details'>
              <p className='item-name'>{item.product.title}</p>
              <p className='item-count'>
                count : <span className='number'>{item.quantity}</span>
              </p>
              <p className='item-price'>
                <span className='number'>₹{item.product.price}</span>
              </p>
              <div className='cart-btns'>
                <button
                  className='delete button'
                  onClick={() => deleteItem(item.id)}
                >
                  delete
                </button>
                <button
                  className='check-out button'
                  onClick={() => navigate('checkout')}
                >
                  go to checkout
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className='cart-container-right'>
        <h1 className='cart-container-head right'>shopping cart</h1>
        <div className='summery-card'>
          <h1 className='summery-card-head'>summery</h1>
          <div className='summery-card-details'>
            <p className='details underline'>total items</p>
            <p className='details'>{totalItems}</p>
            <p className='details underline'>total amount</p>
            <p className='details'>
              <span className='number'>₹{totalPrice}</span>
            </p>
            <button
              className='check-out button'
              disabled={!cart?.items?.length}
              onClick={() => navigate('checkout')}
            >
              go to checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}