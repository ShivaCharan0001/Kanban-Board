# 📋 Kanban Board

Live Deployment: **[https://kanban-board-7taf.vercel.app/](https://kanban-board-7taf.vercel.app/)**

A full-stack Kanban Board web application built with a responsive React frontend and a secure Node.js/Express backend, integrated with MongoDB for database persistence. The application features user authentication using `httpOnly` secure cookies, drag-and-drop workflow status management, and clean minimalist styling.

---

## 🚀 Key Features
- **User Authentication**: Secure signup, login, and session preservation using HTTP-Only cookies (JWT).
- **Kanban Board Workflows**: Create, update, categorize, and delete tasks dynamically.
- **Responsive Layout**: Designed for seamless desktop and mobile use with custom dark-themed aesthetics.
- **Deployment**: Deployed to Vercel.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React (Vite-based)
- **Styling**: Tailwind CSS & Vanilla CSS
- **Icons**: Lucide React

### Backend
- **Server Environment**: Node.js & Express.js
- **Database**: MongoDB (via Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT) & Cookie Parser
- **Development Tools**: Nodemon, Dotenv

---

## ⚙️ Local Installation & Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16+) and [MongoDB](https://www.mongodb.com/) installed on your machine.

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/ShivaCharan0001/Kanban-Board.git
cd Kanban-Board
```

---

### Step 2: Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the provided example template:
   ```bash
   cp .env.example .env
   ```
4. Open the newly created `.env` file and configure your database URI and JWT secret key:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_signature_secret
   PORT=5000
   ```
5. Start the development server (runs with Nodemon):
   ```bash
   npm run dev
   ```

---

### Step 3: Frontend Configuration
1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to **[http://localhost:5173/](http://localhost:5173/)** to use the application.

---

## 📦 Vercel Deployment Settings

The repository is pre-configured with a root-level `vercel.json` and `package.json` for a single-click unified deployment on Vercel:

- **Build Command**: `npm run build` (runs in root to compile the frontend and pack dependencies)
- **Output Directory**: `frontend/dist`
- **Rewrites**: All frontend calls routing to `/api/*` are internally forwarded to the serverless function handler located in `/api/index.js`.
