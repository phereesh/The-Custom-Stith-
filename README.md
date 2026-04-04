# Custom Stitch - Authentication System

A basic authentication system for the Custom Stitch project, created by referencing the GYM master project.

## Features

- User Registration (Sign Up)
- User Login
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes middleware
- React context for auth state management

## Project Structure

```
custom_stitch/
├── server/                 # Backend Node.js application
│   ├── app.js             # Express app entry point
│   ├── routes/            # API route handlers
│   │   └── authRoute.js   # Authentication routes
│   ├── models/            # MongoDB models
│   │   └── User.js        # User model
│   ├── controlllers/      # Route controllers
│   │   └── authController.js  # Auth controllers (register, login)
│   ├── Middlewares/       # Custom middleware
│   │   └── authMiddleware.js   # JWT verification middleware
│   ├── helpers/           # Helper functions
│   │   └── authHelper.js   # Password hashing helpers
│   ├── utils/             # Utility functions
│   │   └── connectDB.js   # MongoDB connection
│   └── package.json
└── client/                 # Frontend React application
    ├── src/
    │   ├── components/    # Reusable React components
    │   │   └── Input.jsx  # Input component
    │   ├── pages/         # Page components
    │   │   ├── Login.jsx  # Login page
    │   │   └── Register.jsx  # Sign up page
    │   ├── context/       # React context providers
    │   │   └── auth.jsx   # Auth context
    │   ├── utils/         # Utility functions
    │   │   └── fetchData.jsx  # API base URL
    │   ├── App.jsx        # Main app component
    │   └── main.jsx       # Entry point
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd custom_stitch/server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd custom_stitch/client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory (optional):
```env
VITE_BASE_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

The client will run on `http://localhost:5173` (or the next available port)

## API Endpoints

### Authentication (`/api/v1/auth`)

- `POST /api/v1/auth/register` - User registration
  - Body: `{ name, email, password, city, contact }`
  - Returns: User object and success message

- `POST /api/v1/auth/login` - User login
  - Body: `{ email, password }`
  - Returns: User object, JWT token, and success message

## Frontend Pages

- `/login` - Login page
- `/register` - Sign up page

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- Bcrypt
- CORS
- dotenv

### Frontend
- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Axios
- React Hot Toast
- AOS (Animate On Scroll)

## Notes

- The authentication system is based on the GYM master project structure
- Passwords are hashed using bcrypt with 10 salt rounds
- JWT tokens expire after 7 days
- Auth state is stored in localStorage and React context
- The UI uses a dark theme with gold accents (tailor-gold: #d4af37)

