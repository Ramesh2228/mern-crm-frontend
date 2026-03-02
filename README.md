# 🚀 MERN CRM Frontend

This is the frontend application for the MERN CRM project.

Built using React.js with secure authentication and a fully responsive UI.

---

## 🌐 Live Application

https://crm-beta-inky.vercel.app

---

## 🛠 Tech Stack

- React.js
- Axios
- React Router
- Context API
- CSS (Responsive Design)
- Vercel (Deployment)

---

## 🔐 Features

- User Signup & Login
- JWT Authentication
- Automatic Token Refresh
- Protected Routes
- Contact CRUD Interface
- Search & Pagination
- Activity Logs Display
- Logout Confirmation
- Fully Responsive Design

---

## 🏗 Architecture

React Frontend
        ↓
Express Backend API
        ↓
MongoDB Atlas

- Frontend communicates with backend via REST API.
- Access token stored in localStorage.
- Refresh token used to maintain session.

---

## 📦 Local Setup

### 1️⃣ Clone Repository

git clone https://github.com/Ramesh2228/mern-crm-frontend.git  
cd mern-crm-frontend  

---

### 2️⃣ Install Dependencies

npm install

---

### 3️⃣ Create Environment File

Create `.env` file:

REACT_APP_API_URL=http://localhost:5000/api

For production:

REACT_APP_API_URL=https://mern-crm-backend-jxmt.onrender.com/api

---

### 4️⃣ Run Application

npm start

Production build:
npm run build

---

## 🚀 Deployment

Frontend is deployed on Vercel.

Environment variables are configured in the Vercel dashboard.

---

## 🔑 Authentication Flow

1. User logs in.
2. Backend returns access + refresh tokens.
3. Access token is used for API calls.
4. Refresh token renews session when access token expires.

---

## 📄 Documentation

Refer to backend repository for API documentation and Postman collection.
