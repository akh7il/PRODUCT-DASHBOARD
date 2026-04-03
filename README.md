# 🛍️ Product Dashboard

A full-stack Product Dashboard application built with **React** (frontend) and **Django REST Framework** (backend).
It includes authentication, Google login, cart system, and admin product management.

---

## 🚀 Features

* 🔐 JWT Authentication (Login / Register)
* 🔑 Google OAuth Login
* 👤 Role-based access (User / Admin)
* 🛒 Cart system with live count
* 📦 Product listing (User view)
* ➕ Add product (Admin only)
* 🖼️ Image upload support
* 🔄 Token-based protected routes

---

## 🏗️ Tech Stack

### Frontend

* React (Vite)
* React Router
* Google OAuth (`@react-oauth/google`)

### Backend

* Django
* Django REST Framework
* Simple JWT
* Google Auth (`google-auth`)

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/product-dashboard.git
cd product-dashboard
```

---

## 🔧 Backend Setup (Django)

### 2️⃣ Create virtual environment

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate  # Mac/Linux
```

### 3️⃣ Install dependencies

```bash
pip install -r requirements.txt
```

### 4️⃣ Run migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5️⃣ Run server

```bash
python manage.py runserver
```

Backend runs at:

```
http://127.0.0.1:8000/
```

---

## 💻 Frontend Setup (React)

### 6️⃣ Install dependencies

```bash
cd frontend
npm install
```

### 7️⃣ Start frontend

```bash
npm run dev
```

Frontend runs at:

```
http://127.0.0.1:5173/
```

---

## 🔐 Google OAuth Setup

### Step 1: Go to Google Cloud Console

👉 https://console.cloud.google.com/

---

### Step 2: Create a Project

* Click **New Project**
* Give any name
* Create

---

### Step 3: Enable APIs

* Go to **APIs & Services → Library**
* Enable:

  * Google Identity Services

---

### Step 4: Create OAuth Client ID

* Go to **APIs & Services → Credentials**
* Click **Create Credentials → OAuth Client ID**
* Choose:

  ```
  Application Type: Web Application
  ```

---

### Step 5: Add Authorized Origins

Add:

```
http://localhost:5173
http://127.0.0.1:5173
```

---

### Step 6: Copy Client ID

You will get:

```
CLIENT_ID = xxxxxxxxxxxxx.apps.googleusercontent.com
```

---

## 🔑 Configure Google in Frontend

### Replace in:

```javascript
<GoogleOAuthProvider clientId="542660838713-algi2r3c18g3koisqe34291m5vrs4utj.apps.googleusercontent.com">
```

File:

```
main.jsx
```

---

## 🔑 Configure Google in Backend

Update your view:

```python
idinfo = id_token.verify_oauth2_token(
    token,
    requests.Request(),
    "YOUR_CLIENT_ID"
)
```

File:

```
accounts/views.py
```

---

## 👤 User Roles

| Role  | Access                             |
| ----- | -----------------------------------|
| User  | View products, cart, checkout, buy |
| Admin | Add products                       |

Default:

```
usertype = "user"
```

Admin can be set manually in database.

---

## 🔐 API Endpoints

| Endpoint             | Method | Description         |
| -------------------- | ------ | ------------------- |
| `/api/register/`     | POST   | Register user       |
| `/api/login/`        | POST   | Login               |
| `/api/google-login/` | POST   | Google login        |
| `/api/products/`     | GET    | Get products        |
| `/api/products/`     | POST   | Add product (Admin) |
| `/api/cart/`         | GET    | Get cart            |

---

## 📁 Project Structure

```
product-dashboard/
│
├── backend/
│   ├── accounts/
│   ├── products/
│   └── manage.py
│
├── frontend/
│   ├── components/
│   ├── pages/
│   └── main.jsx
│
└── README.md
```

---

## ⚠️ Notes

* Make sure backend is running before frontend
* Google login requires correct Client ID in both frontend & backend
* Use `Bearer token` for protected APIs

---

## 👨‍💻 Author

Your Akhil
GitHub: https://github.com/your-username

---

## 🔑 Admin Access (For Testing)

To upload products, you must log in as an **admin user**.

Use the following credentials:

```bash
Email: admin1@gmail.com
Password: Admin1@123
```

After login:

* You will be redirected to the **Admin Dashboard**
* You can add new products with image upload

---

⚠️ Note:

* Only users with `usertype = "admin"` can access this page
* Normal users will be redirected to the user dashboard
