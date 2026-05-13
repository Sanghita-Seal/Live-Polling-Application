
# 🔐 Auth API - Node.js + MongoDB + JWT

A secure and scalable authentication REST API built using Node.js, Express, and MongoDB.  
Implements complete authentication flow including JWT access & refresh tokens, email verification, and password reset.

---

## 🚀 Features

- User Registration
- Login with JWT Authentication
- Access Token & Refresh Token flow
- HTTP-only cookie for refresh token
- Protected routes (middleware-based)
- Email Verification system
- Forgot Password & Reset Password
- Logout functionality
- Secure password hashing (bcrypt)
- Input validation using Joi
- Clean layered architecture

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- Bcrypt
- Joi (Validation)
- Nodemailer
- Cookie-parser
- Dotenv

---

## 📁 Project Structure

```

src/
│
├── common/
│   ├── config/
│   │   ├── db.js
│   │   ├── email.js
│   │
│   ├── dto/
│   │   ├── base.dto.js
│   │
│   ├── middleware/
│   │   ├── validate.middleware.js
│   │
│   ├── utils/
│   │   ├── api-error.js
│   │   ├── api-response.js
│   │   ├── jwt.utils.js
│
├── module/
│   ├── dto/
│   │   ├── register.dto.js
│   │   ├── login.dto.js
│   │   ├── forgot-password.dto.js
│   │   ├── reset-password.dto.js
│
│   ├── auth.controller.js
│   ├── auth.service.js
│   ├── auth.model.js
│   ├── auth.routes.js
│   ├── auth.middleware.js
│
├── app.js
├── server.js

````

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/Sanghita-Seal/auth-api-nodejs-mongodb-jwt.git

cd auth-api-nodejs-mongodb-jwt
````

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Create `.env` file

```env
PORT=your port number
NODE_ENV=development
MONGODB_URI=your_mongodb_uri

JWT_ACCESS_SECRET=abcd
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=abcde
JWT_REFRESH_EXPIRES_IN=7d
```

---

### 4. Run the server

```bash
npm start
```

Server runs at:

```
http://localhost:8080
```

---

## 📬 API Endpoints

### 🔑 Auth Routes

| Method | Endpoint                        | Description                  |
| ------ | ------------------------------- | ---------------------------- |
| POST   | /api/auth/register              | Register user                |
| POST   | /api/auth/login                 | Login user                   |
| POST   | /api/auth/refresh-token         | Refresh access token         |
| POST   | /api/auth/logout                | Logout user                  |
| GET    | /api/auth/me                    | Get current user (Protected) |
| GET    | /api/auth/verify-email/:token   | Verify email                 |
| POST   | /api/auth/forgot-password       | Send reset link              |
| PUT    | /api/auth/reset-password/:token | Reset password               |

---

## 🔐 Authentication Flow

1. User logs in and receives:

   * Access Token (short-lived)
   * Refresh Token (stored in HTTP-only cookie)

2. Access token is used for protected routes:

```
Authorization: Bearer <access_token>
```

3. Refresh token is used to generate a new access token.

---

## 🧪 Testing

Use Postman or any API client.

### Example Login Request

```json
{
  "email": "test@gmail.com",
  "password": "12345678"
}
```

---

## 🧠 Learning Highlights

* Built complete authentication system from scratch
* Implemented JWT with access + refresh tokens
* Handled authentication middleware and protected routes
* Implemented password reset flow with token expiry
* Applied DTO-based validation using Joi
* Debugged real-world backend issues

---

## 📌 Future Improvements

* Role-based authorization (Admin / Seller / Customer)
* Rate limiting for login attempts
* Swagger API documentation
* Email service production integration (Brevo / Resend)
* Deployment (Render / Railway)

---

## 👨‍💻 Author

Sanghita Seal
---

## ⭐ If you like this project

Give it a star on GitHub ⭐
