# 📝 Blog App Backend

A TypeScript-based Express backend for a blog application. Features include user authentication, comments, blog management, validation, API docs with Swagger, and more.

---

## 🚀 Getting Started (Local Development)

### ✅ Prerequisites

Before running locally, ensure you have:

* **Node.js** (v18+ recommended)
* **npm** (v9+)
* **MongoDB** running locally or cloud instance (MongoDB Atlas)
* A `.env` file in the root directory

### 📦 Install Dependencies

```bash
npm install
```

---

## 🔧 Environment Setup

Create a `.env` file in the root directory and add the following variables:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/blog-app
JWT_SECRET=your_jwt_secret
```

Add other environment-specific variables (e.g., `ACCESS_TOKEN_SECRET_KEY`, `ACCESS_TOKEN_EXPIRES_IN`, `REFRESH_TOKEN_SECRET_KEY`, `REFRESH_TOKEN_EXPIRES_IN`etc.) as required by the app.

---

## 🛠️ Run in Development

```bash
npm run dev
```

Runs the app using `tsx` with hot-reload.

---

## 📦 Build for Production

```bash
npm run build
```

Compiles TypeScript files into `dist/`.

### 🚀 Start Production Build

```bash
npm start
```

Starts the compiled app using `node dist/server.js`.

---

## 📁 Project Structure

```
├── package.json
├── package-lock.json
├── src
│   ├── app.ts
│   ├── configs
│   │   ├── corn.config.ts
│   │   ├── db.config.ts
│   │   ├── email.config.ts
│   │   └── swagger.config.ts
│   ├── controllers
│   │   ├── auth.controller.ts
│   │   ├── blog.controller.ts
│   │   ├── comment.controller.ts
│   │   ├── error.controller.ts
│   │   └── torrent.controller.ts
│   ├── interfaces
│   │   └── email.interface.ts
│   ├── models
│   │   ├── blog.model.ts
│   │   ├── comment.model.ts
│   │   └── user.model.ts
│   ├── routes
│   │   ├── blog.route.ts
│   │   ├── comment.route.ts
│   │   └── user.route.ts
│   ├── server.ts
│   ├── services
│   │   ├── email.service.ts
│   │   └── template.service.ts
│   ├── templates
│   │   └── RESET_PASSWORD.html
│   ├── types
│   └── utils
│       ├── app-error.util.ts
│       ├── catch-async.util.ts
│       ├── logger.util.ts
│       ├── otp.util.ts
│       └── token.util.ts
└── tsconfig.json
```

---

## 📘 API Documentation

Swagger docs are available at:

```
http://localhost:3000/api/docs
```

---

## 📦 Dev Dependencies

Some key dev tools:

* `tsx` - For running TS in dev mode with hot reload
* `tsup`, `rimraf` - For efficient builds
* `nodemon`, `ts-node` - Optional alternative for development

---

## 📚 Tech Stack

* **TypeScript**
* **Express.js**
* **MongoDB with Mongoose**
* **JWT Auth**
* **Swagger UI**
* **Pino** (Logging)
* **Helmet, Rate Limiting, Validation**

---

## ✨ Author

Sourav Mandal
