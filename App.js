import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { NotificationProvider } from './src/contexts/NotificationContext';
import { LoadingProvider } from './src/contexts/LoadingContext';

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <LoadingProvider>
          <NotificationProvider>
            <NavigationContainer>
              <StatusBar style="light" backgroundColor="#1DA1F2" />
              <AppNavigator />
            </NavigationContainer>
          </NotificationProvider>
        </LoadingProvider>
      </SafeAreaProvider>
    </Provider>
  );
}