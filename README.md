# 🍔 Talabat - Food Delivery Platform

A comprehensive full-stack food delivery platform inspired by Talabat, built with modern web technologies. This project includes a robust RESTful API backend and a modern frontend application.

## 📋 Project Overview

Talabat is a complete food delivery ecosystem that connects customers, restaurants, and delivery personnel through a seamless digital platform. The project is structured as a monorepo containing both backend API and frontend applications.

## 🏗️ Project Structure

```
Talabat/
├── Api/                    # Backend RESTful API
│   ├── src/
│   │   ├── modules/        # Feature-based modules
│   │   │   ├── auth/       # Authentication & authorization
│   │   │   ├── customer/   # Customer management
│   │   │   ├── restaurant/ # Restaurant operations
│   │   │   ├── delivery/   # Delivery management
│   │   │   ├── order/      # Order processing
│   │   │   ├── meal/       # Menu & meal management
│   │   │   ├── admin/      # Administrative functions
│   │   │   └── shared/     # Shared utilities
│   │   ├── config/         # Configuration files
│   │   └── docs/           # API documentation
│   ├── package.json
│   ├── README.md           # API-specific documentation
│   └── LICENSE
└── FrontEnd/               # Frontend application (Coming Soon)
    └── .gitkeep
```

## 🚀 Features

### 🏪 Restaurant Management
- **Restaurant Registration**: Complete onboarding process for restaurants
- **Menu Management**: Add, edit, and organize meals and categories
- **Order Processing**: Real-time order management and status updates
- **Analytics Dashboard**: Revenue tracking and performance metrics
- **Availability Control**: Manage restaurant hours and availability

### 👥 Multi-Role User System
- **Customers**: Browse restaurants, place orders, track deliveries
- **Restaurant Owners**: Manage menus, process orders, view analytics
- **Delivery Personnel**: Accept deliveries, update status, track earnings
- **Administrators**: Platform oversight and management

### 🛍️ Order Management
- **Real-time Ordering**: Instant order placement and confirmation
- **Order Tracking**: Live status updates from preparation to delivery
- **Payment Integration**: Secure payment processing
- **Rating System**: Customer feedback and restaurant ratings
- **Order History**: Complete transaction records

### 🚚 Delivery System
- **Smart Assignment**: Optimal delivery personnel matching
- **Location Tracking**: Real-time delivery tracking
- **Performance Metrics**: Delivery time and success rate tracking
- **Availability Management**: Flexible scheduling for delivery staff

## 🛠️ Tech Stack

### Backend (API)
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS, Rate Limiting
- **Email Service**: Nodemailer
- **Development**: ts-node-dev, ESLint, Prettier

### Frontend (In Development)
- **Framework**: [To be determined - React/Vue/Angular]
- **State Management**: [To be determined]
- **Styling**: [To be determined]
- **Build Tool**: [To be determined]

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn package manager

### Backend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ahmedfahmy8308/Talabat-Nti-Project.git
   cd Talabat
   ```

2. **Navigate to API directory**:
   ```bash
   cd Api
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Environment Configuration**:
   Create a `.env` file in the `Api` directory:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/talabat
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

### API Documentation
Once the server is running, you can access the interactive API documentation at:
- **Swagger UI**: `http://localhost:3000/api-docs`

## 📚 Documentation

- **[API Documentation](./Api/README.md)**: Comprehensive backend API documentation
- **[API Endpoints](./Api/README.md#api-endpoints)**: Detailed endpoint documentation
- **[Database Schema](./Api/README.md#database-schema)**: Database structure and relationships
- **[Contributing Guidelines](./Api/CONTRIBUTING.md)**: How to contribute to the project

## 🧪 Testing

### API Testing
```bash
cd Api
npm test
```

### Code Quality
```bash
cd Api
npm run lint        # Check for linting errors
npm run format      # Format code with Prettier
npm run check       # Run all quality checks
```

## 🔧 Available Scripts

### Backend (Api directory)
- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run test suite

## 🏛️ Architecture

The project follows a modular architecture pattern:

### Backend Architecture
- **Modular Structure**: Feature-based modules for scalability
- **Layered Architecture**: Controllers → Services → Data Access
- **Middleware Pipeline**: Authentication, validation, and error handling
- **Database Abstraction**: MongoDB with Mongoose ODM
- **API Documentation**: Auto-generated Swagger documentation

### Security Features
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Multi-level user permissions
- **Rate Limiting**: API abuse prevention
- **Data Validation**: Request/response validation
- **Security Headers**: Helmet.js security middleware

## 🚧 Development Status

| Component | Status | Description |
|-----------|--------|-------------|
| Backend API | ✅ Complete | Full-featured RESTful API |
| Authentication | ✅ Complete | Multi-role JWT authentication |
| Database Design | ✅ Complete | MongoDB schemas and relationships |
| API Documentation | ✅ Complete | Swagger/OpenAPI documentation |
| Frontend | 🚧 Planned | Modern web application |
| Mobile App | 📋 Planned | React Native/Flutter app |
| Admin Dashboard | 📋 Planned | Administrative interface |

## 🤝 Contributing

We welcome contributions to the Talabat project! Please see our [Contributing Guidelines](./Api/CONTRIBUTING.md) for details on:

- Code of conduct
- Development process
- Pull request procedure
- Coding standards
- Testing requirements

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./Api/LICENSE) file for details.

## 👨‍💻 Author

**Ahmed Fahmy**
- GitHub: [@Ahmedfahmy8308](https://github.com/Ahmedfahmy8308)
- Project: [Talabat-Nti-Project](https://github.com/Ahmedfahmy8308/Talabat-Nti-Project)

## 🙏 Acknowledgments

- Inspired by Talabat's food delivery platform
- Built as part of NTI (National Technology Institute) project
- Thanks to the open-source community for the amazing tools and libraries

## 📞 Support

If you have any questions or need support, please:
1. Check the [API documentation](./Api/README.md)
2. Search existing [issues](https://github.com/Ahmedfahmy8308/Talabat-Nti-Project/issues)
3. Create a new issue if needed

---

**⭐ Star this repository if you find it helpful!**
