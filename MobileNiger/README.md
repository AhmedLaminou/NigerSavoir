# Niger Savoir+ Mobile

Mobile application for the Niger Savoir+ exam sharing platform, built with React Native and Expo.

## 📱 Features

- **User Authentication**: Login and registration with JWT tokens
- **Automatic Network Joining**: Users are automatically added to school, city, and region networks
- **Modern UI**: Gradient backgrounds, glassmorphism effects, and smooth animations
- **Cross-Platform**: Works on iOS and Android
- **Offline Token Storage**: Secure token management with AsyncStorage

## 🏗️ Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **API Communication**: Axios
- **Storage**: AsyncStorage
- **UI**: React Native Paper, Linear Gradient
- **Language**: TypeScript

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- Android Studio (for Android) or Xcode (for iOS)
- Running backend server (Spring Boot)

## 🚀 Installation

### 1. Install Dependencies

```bash
cd MobileNiger
npm install
```

### 2. Configure API Endpoint

Edit `services/api.ts` and update the `BASE_URL`:

```typescript
// For Android Emulator
const BASE_URL = "http://10.0.2.2:8080/api";

// For iOS Simulator
const BASE_URL = "http://localhost:8080/api";

// For Physical Device (replace with your computer's IP)
const BASE_URL = "http://192.168.1.X:8080/api";
```

**To find your IP address**:

- Windows: `ipconfig` (look for IPv4 Address)
- Mac/Linux: `ifconfig` or `ip addr`

### 3. Start the Backend

Make sure your Spring Boot backend is running:

```bash
cd ../BackNiger
mvn spring-boot:run
```

Backend should be running on `http://localhost:8080/api`

### 4. Start the Mobile App

```bash
npm start
```

This will open Expo Dev Tools in your browser.

## 📱 Running on Devices

### Android Emulator

1. Start Android Studio and launch an emulator
2. In Expo Dev Tools, press `a` or click "Run on Android device/emulator"

### iOS Simulator (Mac only)

1. Make sure Xcode is installed
2. In Expo Dev Tools, press `i` or click "Run on iOS simulator"

### Physical Device

1. Install **Expo Go** app from:

   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) (Android)
   - [App Store](https://apps.apple.com/app/expo-go/id982107779) (iOS)

2. Scan the QR code shown in Expo Dev Tools

3. **Important**: Make sure your phone and computer are on the same WiFi network

4. Update `BASE_URL` in `services/api.ts` with your computer's IP address

## 🎯 App Structure

```
MobileNiger/
├── app/                    # Screens (Expo Router)
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # Entry point (redirects to login)
│   ├── login.tsx          # Login screen
│   ├── register.tsx       # Registration screen
│   └── home.tsx           # Home screen
├── services/
│   └── api.ts             # API service and axios configuration
├── app.json               # Expo configuration
└── package.json           # Dependencies
```

## 🔐 Authentication Flow

1. **Register**: User creates account with name, email, password, city, and region
2. **Auto-Network Join**: User is automatically added to:
   - City network
   - Region network
   - School network (if provided)
3. **JWT Token**: Token is stored in AsyncStorage
4. **Auto-Login**: Token is automatically attached to all API requests

## 🌐 API Integration

The app connects to the same Spring Boot backend as the web version:

### Available Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/documents` - Get documents (requires auth)
- `GET /api/networks` - Get networks (requires auth)

### Example API Call

```typescript
import { authAPI } from "./services/api";

// Register
const response = await authAPI.register({
  name: "Ahmed Laminou",
  email: "ahmed@example.com",
  password: "password123",
  city: "Niamey",
  region: "Niamey",
});

// Login
const loginResponse = await authAPI.login("ahmed@example.com", "password123");
```

## 🎨 Customization

### Colors

The app uses the same color scheme as the web version:

- **Primary**: `#E67E22` (Terracotta)
- **Secondary**: `#D35400` (Dark Orange)
- **Accent**: `#0077BE` (Deep Blue)

### Gradient

```typescript
<LinearGradient
  colors={['#E67E22', '#D35400', '#0077BE']}
  style={styles.gradient}
>
```

## 🐛 Troubleshooting

### Cannot connect to backend

1. **Check backend is running**: Visit `http://localhost:8080/api` in browser
2. **Update BASE_URL**: Use correct IP address for your device type
3. **Firewall**: Make sure Windows Firewall allows connections on port 8080
4. **Network**: Ensure phone and computer are on same WiFi

### "Network request failed"

- For physical device: Use your computer's IP address, not `localhost`
- For Android emulator: Use `10.0.2.2` instead of `localhost`
- For iOS simulator: `localhost` should work

### App crashes on startup

```bash
# Clear cache and restart
npm start --clear
```

## 📦 Building for Production

### Android APK

```bash
expo build:android
```

### iOS IPA

```bash
expo build:ios
```

## 🔄 Future Features

- [ ] Document browsing and search
- [ ] Document upload with camera
- [ ] Network discovery and feeds
- [ ] Push notifications
- [ ] Offline document viewing
- [ ] User profiles
- [ ] Recommendations

## 👨‍💻 Development

### Add new screen

1. Create file in `app/` directory: `app/newscreen.tsx`
2. Add navigation: `router.push('/newscreen')`

### Add new API endpoint

1. Update `services/api.ts`
2. Add function to appropriate API object

## 📄 License

MIT License

## 👥 Author

**Laminou Amadou Ahmed**

---

**Note**: This mobile app shares the same backend with the web version. Make sure the Spring Boot server is running before testing the mobile app.
