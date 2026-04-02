import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import "../styles/Login.css";

export default function Login() {
    const navigate = useNavigate()
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };
    const validate = () => {
        let newErrors = {};

        if (!isLogin && !formData.name.trim()) {
            newErrors.name = "Full name is required";
        }

        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Enter a valid email";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (!isLogin) {
            if (formData.password.length < 6) {
                newErrors.password = "Minimum 6 characters required";
            } else if (!/[A-Z]/.test(formData.password)) {
                newErrors.password = "Must contain uppercase letter";
            }
        }

        if (!isLogin) {
            if (!formData.confirmPassword) {
                newErrors.confirmPassword = "Confirm your password";
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match";
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            if (isLogin) {
                const response = await fetch("http://127.0.0.1:8000/api/login/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password
                    })
                });
                const data = await response.json();
                if (response.ok) {
                    localStorage.setItem("access", data.access);
                    localStorage.setItem("usertype", data.usertype);
                    localStorage.setItem("user_name", data.full_name || formData.email);

                    if (data.usertype === "admin") {
                        navigate("/admin");
                    } else {
                        navigate("/user");
                    }
                } else {
                    setErrors({ password: data.detail });
                }
            } else {
                const response = await fetch("http://127.0.0.1:8000/api/register/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        full_name: formData.name,
                        email: formData.email,
                        password: formData.password
                    })
                });
                const data = await response.json();
                if (response.ok) {
                    const loginResponse = await fetch("http://127.0.0.1:8000/api/login/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            email: formData.email,
                            password: formData.password
                        })
                    });

                    const loginData = await loginResponse.json();
                    if (loginResponse.ok) {
                        localStorage.setItem("access", loginData.access);
                        localStorage.setItem("usertype", loginData.usertype);
                        localStorage.setItem("user_name", loginData.full_name || formData.email);
                        navigate("/user");
                    } else {
                        setIsLogin(true);
                    }
                } else {
                    if (data.email) {
                        setErrors({ email: data.email[0] });
                    }
                    if (data.full_name) {
                        setErrors({ name: data.full_name[0] });
                    }
                    if (data.password) {
                        setErrors({ password: data.password[0] });
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/google-login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token: credentialResponse.credential
                })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("access", data.access);
                localStorage.setItem("usertype", data.usertype);
                localStorage.setItem("user_name", data.full_name || data.email);

                if (data.usertype === "admin") {
                    navigate("/admin");
                } else {
                    navigate("/user");
                }
            } else {
                alert("Google login failed");
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-container-brand">
                    <h1 className="brand-name">Product Dashboard</h1>
                </div>
                <h1 className="login-container-head">
                    {isLogin ? "Sign In" : "Create Account"}
                </h1>
                <form className="login-container-form" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <>
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                className="login-container-form-input"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {errors.name && <span className="error-text">{errors.name}</span>}
                        </>
                    )}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        className="login-container-form-input"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                    <div className="password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            className="login-container-form-input"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <span
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </span>
                    </div>
                    {errors.password && <span className="error-text">{errors.password}</span>}
                    {!isLogin && (
                        <>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                className="login-container-form-input"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            {errors.confirmPassword && (
                                <span className="error-text">{errors.confirmPassword}</span>
                            )}
                        </>
                    )}
                    <button className="login-btn">
                        {isLogin ? "Sign In" : "Sign Up"}
                    </button>
                </form>
                <span className="other-login-method">or continue with</span>
                <div className="other-login-options">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => alert("Google Login Failed")}
                    />
                </div>
                <span className="login-container-footer">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <span
                        className="switch-mode"
                        onClick={() => { setIsLogin(!isLogin); setErrors({}); }}
                    >
                        {isLogin ? " Sign Up" : " Sign In"}
                    </span>
                </span>
            </div>
        </div>
    );
}