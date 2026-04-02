import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import { useNavigate } from 'react-router-dom'
import '../styles/Products.css'

export default function Products() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  useEffect(() => {
    fetchProducts()
  }, [])
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("access")
      const response = await fetch("http://127.0.0.1:8000/api/products/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
      if (response.status === 401) {
        localStorage.removeItem("access")
        navigate("/")   
        return
      }
      const data = await response.json()
      if (response.ok) {
        setProducts(data)
      } else {
        console.log(data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='products-container'>
      <Navbar />
      <div className='show-products'>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}