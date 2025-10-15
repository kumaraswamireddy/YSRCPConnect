import React, { createContext, useContext, useState, useRef } from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const loadingCount = useRef(0);

  const showLoading = (message = '') => {
    loadingCount.current += 1;
    if (loadingCount.current === 1) {
      setLoadingMessage(message);
      setIsLoading(true);
    }
  };

  const hideLoading = () => {
    loadingCount.current = Math.max(0, loadingCount.current - 1);
    if (loadingCount.current === 0) {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const withLoading = async (callback, message = '') => {
    try {
      showLoading(message);
      const result = await callback();
      return result;
    } finally {
      hideLoading();
    }
  };

  const value = {
    isLoading,
    loadingMessage,
    showLoading,
    hideLoading,
    withLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export default LoadingContext;