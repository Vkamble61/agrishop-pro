# AgriShop Pro - Setup & Development Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
  - OR **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/downloads)
- A code editor (VS Code recommended)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (Choose one)
# For MongoDB:
MONGODB_URI=mongodb://localhost:27017/agrishop-pro

# For PostgreSQL:
# DATABASE_URL=postgresql://username:password@localhost:5432/agrishop_pro

# JWT Secret (Change this!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Frontend URL
CLIENT_URL=http://localhost:3000
```

### 3. Database Setup

#### For MongoDB:
```bash
# Start MongoDB service
# Windows:
net start MongoDB

# macOS (with Homebrew):
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

#### For PostgreSQL:
```bash
# Create database
createdb agrishop_pro

# Or using psql:
psql -U postgres
CREATE DATABASE agrishop_pro;
\q
```

### 4. Start Development Servers

```bash
# Start both frontend and backend concurrently
npm run dev

# OR start them separately:

# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
agrishop-pro/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   └── PrivateRoute.js
│   │   ├── pages/         # Page components
│   │   │   ├── HomePage.js
│   │   │   ├── FarmerLogin.js
│   │   │   ├── FarmerRegister.js
│   │   │   ├── FarmerDashboard.js
│   │   │   ├── AdminLogin.js
│   │   │   └── Reviews.js
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   ├── styles/        # Global styles
│   │   ├── App.js         # Main app component
│   │   ├── index.js       # Entry point
│   │   └── i18n.js        # Internationalization
│   └── package.json
├── server/                # Node.js backend
│   ├── routes/           # API routes
│   ├── controllers/      # Business logic
│   ├── models/           # Database models
│   ├── middleware/       # Custom middleware
│   └── config/           # Configuration files
├── .env                  # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary (Forest Green)**: `#2D5016`
- **Secondary (Golden Amber)**: `#D4880A`
- **Background (Warm White)**: `#FAF8F2`
- **Text (Charcoal)**: `#1C1C1C`

### Typography
- **Headings**: Poppins
- **Body**: Inter

## 🔑 Default Credentials (Development)

### Farmer Account
- Email: `farmer@example.com`
- Password: `farmer123`

### Admin Account
- Email: `admin@agrishoppro.com`
- Password: `admin123`

## 📝 Available Scripts

### Root Directory
- `npm run dev` - Start both frontend and backend
- `npm run server` - Start backend only
- `npm run client` - Start frontend only
- `npm run install-all` - Install all dependencies

### Client Directory
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 🌐 API Endpoints (To Be Implemented)

### Authentication
- `POST /api/auth/register` - Register new farmer
- `POST /api/auth/login` - Login (farmer/admin)
- `GET /api/auth/me` - Get current user

### Farmers
- `GET /api/farmers` - Get all farmers (admin)
- `GET /api/farmers/:id` - Get farmer by ID
- `PUT /api/farmers/:id` - Update farmer profile

### Equipment
- `GET /api/equipment` - Get all equipment
- `GET /api/equipment/:id` - Get equipment by ID
- `POST /api/equipment` - Add new equipment (admin)
- `PUT /api/equipment/:id` - Update equipment (admin)
- `DELETE /api/equipment/:id` - Delete equipment (admin)

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status (admin)

### Reviews
- `GET /api/reviews` - Get all reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

## 🔧 Development Tips

### Hot Reload
Both frontend and backend support hot reload during development. Changes will automatically reflect without restarting servers.

### Debugging
- Frontend: Use React DevTools browser extension
- Backend: Use VS Code debugger or `console.log()`

### Code Style
- Use ES6+ features
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused

## 🚢 Production Deployment

### Build Frontend
```bash
cd client
npm run build
```

### Environment Variables
Update `.env` for production:
```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_strong_production_secret
CLIENT_URL=https://your-domain.com
```

### Deploy Options
- **Frontend**: Vercel, Netlify, AWS S3
- **Backend**: Heroku, AWS EC2, DigitalOcean
- **Database**: MongoDB Atlas, AWS RDS

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### MongoDB Connection Issues
- Ensure MongoDB service is running
- Check connection string in `.env`
- Verify network access

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is private and proprietary.

## 💬 Support

For questions or issues, contact the development team.