import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Admindashboard.css'

export default function AdminDashboard() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        description: '',
        image: null
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
        setError('')
        setSuccess('')
    }

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            image: e.target.files[0]
        })
        setError('')
        setSuccess('')
    }

    const handleLogout = () => {
        localStorage.removeItem('access')
        localStorage.removeItem('refresh')
        localStorage.removeItem('usertype')
        localStorage.removeItem('user_name')
        navigate('/')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.title || !formData.price || !formData.description) {
            setError('Please fill in all fields')
            return
        }

        setLoading(true)
        setError('')
        setSuccess('')

        const formDataToSend = new FormData()
        formDataToSend.append('title', formData.title)
        formDataToSend.append('price', formData.price)
        formDataToSend.append('description', formData.description)
        if (formData.image) {
            formDataToSend.append('image', formData.image)
        }

        try {
            const token = localStorage.getItem('access')
            const response = await fetch('http://127.0.0.1:8000/api/products/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            })

            if (response.status === 401) {
                navigate('/')
                return
            }

            const data = await response.json()

            if (response.ok) {
                setSuccess('Product added successfully')
                setFormData({
                    title: '',
                    price: '',
                    description: '',
                    image: null
                })
                document.getElementById('image').value = ''
                setTimeout(() => setSuccess(''), 3000)
            } else {
                if (data.title) setError(data.title[0])
                else if (data.price) setError(data.price[0])
                else if (data.description) setError(data.description[0])
                else setError('Failed to add product. Please try again.')
            }
        } catch (error) {
            console.log(error)
            setError('Network error. Please check your connection.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="admin-dashboard">
            <div className="dashboard-container">
                <div className="add-product-card">
                    <div className="card-header">
                        <h2>Add New Product</h2>
                        <p>Fill in the details below to add a new product to your store</p>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                    <form className="product-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="title">Product Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="Enter product title"
                                className="form-input"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="price">Price</label>
                                <input
                                    type="text"
                                    id="price"
                                    name="price"
                                    placeholder="Enter price"
                                    className="form-input"
                                    value={formData.price}
                                    onChange={handleChange}
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="image">Product Image</label>
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    accept="image/*"
                                    className="form-input file-input"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Enter product description"
                                className="form-textarea"
                                rows="5"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'Adding Product...' : 'Add Product'}
                        </button>
                        <button type="button" className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}