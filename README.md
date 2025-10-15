# YSRCPConnect Mobile Application

A React Native with Expo mobile application for YSRCPConnect, a political party social media platform designed to connect party workers and committee members.

## Features

- **Authentication**: Google OAuth integration for secure login
- **User Profiles**: Dual-tab system for personal and official information
- **Verification System**: Differentiated verification badges for admins and committee members
- **Feed System**: Infinite scroll with priority algorithm for official posts
- **Post Creation**: Support for text, images, and videos
- **Notifications**: Real-time notifications for likes, comments, follows, etc.
- **Role-Based Access**: Different features based on user roles (worker, committee, admin)
- **Media Upload**: Support for multiple images and videos
- **Responsive Design**: Optimized for different screen sizes

## Tech Stack

- **Framework**: React Native with Expo
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation
- **Authentication**: Expo Auth Session with Google OAuth
- **Storage**: AsyncStorage for local data
- **Media**: Expo Image Picker, Expo Camera, Expo AV
- **Notifications**: Expo Notifications
- **Icons**: React Native Vector Icons

## Project Structure

```
YSRCPConnect/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Common components
│   │   ├── feed/           # Feed-related components
│   │   ├── media/          # Media-related components
│   │   ├── notifications/  # Notification components
│   │   └── profile/        # Profile-related components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom hooks
│   ├── navigation/         # Navigation configuration
│   ├── screens/            # Screen components
│   │   ├── auth/           # Authentication screens
│   │   ├── home/           # Home screens
│   │   ├── notifications/  # Notification screens
│   │   └── profile/        # Profile screens
│   ├── services/           # API and service layers
│   ├── store/              # Redux store and slices
│   └── utils/              # Utility functions and constants
├── assets/                 # Static assets
├── App.js                  # Main app component
├── app.json               # Expo configuration
└── package.json           # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Android Studio / Xcode (for testing on device/simulator)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/YSRCPConnect.git
cd YSRCPConnect
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add the following:
```
EXPO_PUBLIC_API_URL=https://api.ysrcp-connect.com/api
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

4. Start the development server:
```bash
npm start
# or
yarn start
```

5. Run the app on your device/simulator:
- Scan the QR code with Expo Go app
- Or run `npm run android` / `npm run ios` / `npm run web`

## Environment Variables

- `EXPO_PUBLIC_API_URL`: Base URL for the API
- `EXPO_PUBLIC_GOOGLE_CLIENT_ID`: Google OAuth client ID

## Key Components

### Authentication

- **LoginScreen**: Google OAuth login interface
- **RoleSelectionScreen**: User role selection (worker/committee)
- **VerificationScreen**: Document upload for committee verification

### Navigation

- **AppNavigator**: Main navigation container
- **AuthNavigator**: Authentication flow navigation
- **TabNavigator**: Bottom tab navigation for main app

### Feed

- **FeedScreen**: Main feed with infinite scroll
- **PostCard**: Individual post component
- **CreatePostScreen**: Post creation interface

### Profile

- **ProfileScreen**: User profile with dual tabs
- **ProfileHeader**: Profile header with avatar and info
- **ProfileStats**: User stats (posts, followers, following)
- **ProfileActions**: Action buttons (follow, message, etc.)

### Notifications

- **NotificationsScreen**: List of notifications
- **NotificationItem**: Individual notification component

## Services

- **apiService**: Base API service with request/response handling
- **authService**: Authentication service with Google OAuth
- **feedService**: Feed-related API calls
- **profileService**: Profile-related API calls
- **notificationService**: Notification-related API calls
- **storageService**: Local storage management

## State Management

- **authSlice**: Authentication state and actions
- **feedSlice**: Feed state and actions
- **profileSlice**: Profile state and actions
- **notificationsSlice**: Notifications state and actions

## Custom Hooks

- **useAuth**: Authentication-related functionality
- **useFeed**: Feed-related functionality
- **useProfile**: Profile-related functionality

## Utils

- **constants**: App constants and configuration
- **helpers**: Helper functions for common tasks
- **validators**: Input validation functions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- YSRCP party for the opportunity to build this platform
- React Native and Expo communities for the excellent tools and documentation
- All contributors who have helped shape this project