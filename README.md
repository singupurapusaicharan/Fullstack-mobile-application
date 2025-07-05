# Full-Stack Mobile Application

A full-stack mobile application built with React Native and Node.js, featuring authentication, data management, and various mobile functionalities.

## 🚀 Features

- User Authentication (Sign In/Sign Up)
- OTP Verification
- Data Table Management
- PDF Generation
- SMS Integration
- Email Functionality
- Cross-platform Support (iOS & Android)

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- React Native development environment setup
- iOS Simulator (for Mac) or Android Emulator

## 🛠️ Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd Fullstack-mobile-application

```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

## 🔧 Configuration

1. Create a `.env` file in the root directory with the following variables:
```
# Add your environment variables here
```

2. Configure backend settings in `backend/config/`

## 🚀 Running the Application

### Frontend
```bash
# Start the Expo development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on Web
npm run web
```

### Backend
```bash
cd backend
npm start
```

## 📱 Available Scripts

- `npm start` - Starts the Expo development server
- `npm run android` - Runs the app on Android
- `npm run ios` - Runs the app on iOS
- `npm run web` - Runs the app in web browser

## 🏗️ Project Structure

```
AwesomeProject/
├── assets/              # Static assets
├── backend/            # Backend server
│   ├── config/        # Configuration files
│   ├── routes/        # API routes
│   └── index.js       # Server entry point
├── screens/           # React Native screens
│   ├── SignIn.js
│   ├── SignUp.js
│   ├── OTPVerification.js
│   └── Table.js
├── App.js             # Main application component
└── package.json       # Project dependencies
```

## 📦 Dependencies

### Frontend
- React Native
- Expo
- React Navigation
- Async Storage
- Axios
- Various Expo modules (Print, SMS, Sharing)

### Backend
- Express.js
- Node.js
- Additional backend dependencies

## 🔐 Security

- Secure authentication system
- OTP verification
- Environment variable protection
- Secure API endpoints


## 👥 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
