import React from 'react'
import Login from './pages/Login'
import Products from './pages/Products'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import PurchaseSuccess from './pages/PurchaseSuccess'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/user" element={<Products />} />
      <Route path='/user/cart' element={<Cart/>}/>
      <Route path='/user/cart/checkout' element={<Checkout/>}/>
      <Route path='/user/cart/checkout/success' element={<PurchaseSuccess/>}/>
      <Route path='/admin' element={<AdminDashboard/>}/>
    </Routes>
  )
}