# AgriShop Pro - Agriculture Equipment Management Platform

A professional web application for managing agriculture equipment business operations, built with trust and community at its core.

## 🌾 Project Overview

AgriShop Pro is a comprehensive platform designed for agriculture equipment businesses to manage inventory, customers, orders, and build lasting relationships with farmers through digital transformation.

## 📁 Project Structure

```
agrishop-pro/
├── client/                 # React frontend
│   ├── public/            # Static files
│   └── src/
│       ├── components/    # Reusable UI components
│       ├── pages/         # Page components
│       ├── services/      # API services
│       ├── utils/         # Utility functions
│       ├── assets/        # Images, icons
│       └── styles/        # CSS files
├── server/                # Node.js backend
│   ├── routes/           # API routes
│   ├── controllers/      # Business logic
│   ├── models/           # Database models
│   ├── middleware/       # Custom middleware
│   └── config/           # Configuration files
└── package.json          # Root dependencies

```

## 🎨 Design Theme

- **Primary Color**: Forest Green (#2D5016)
- **Secondary Color**: Golden Amber (#D4880A)
- **Background**: Warm White (#FAF8F2)
- **Text**: Charcoal (#1C1C1C)

## ✨ Features

### Farmer Portal
- Registration & Login
- Equipment Catalogue with filters
- Order Management Dashboard
- Finance & EMI Calculator
- Service Tracking
- Notifications

### Owner/Admin Dashboard
- Supplier Management
- Inventory Control
- Customer Loyalty Programs
- Order Processing
- Revenue Analytics
- Discount Management

### Trust & Community
- Customer Reviews & Testimonials
- Referral Tracking
- Featured Success Stories

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB or PostgreSQL
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm run install-all
```

3. Create `.env` file in root directory:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Start development servers:
```bash
npm run dev
```

The client will run on `http://localhost:3000` and server on `http://localhost:5000`

## 🛠️ Technology Stack

- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **UI**: Custom CSS with responsive design
- **Internationalization**: i18next (Hindi/English support)

## 📱 Mobile Responsive

The application is built with a mobile-first approach, ensuring seamless experience across all devices.

## 🌐 Language Support

- English (default)
- Hindi (हिंदी)
- Regional language support can be added

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation
- CORS protection

## 📄 License

This project is private and proprietary.

## 👨‍💻 Development

Built with care for a family-run agriculture equipment business.