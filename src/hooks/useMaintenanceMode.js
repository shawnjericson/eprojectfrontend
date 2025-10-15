import { useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS } from '../config/api';

const useMaintenanceMode = (options = {}) => {
  const {
    apiUrl = `${API_ENDPOINTS.base}/health`,
    maintenanceUrl = '/maintenance',
    checkInterval = 30000, // 30 seconds
    retryCount: maxRetryCount = 3,
    autoRedirect = true
  } = options;

  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const checkMaintenanceStatus = useCallback(async () => {
    setIsChecking(true);
    setError(null);

    try {
      console.log('Checking maintenance status at:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        // Don't follow redirects to detect 503 status
        redirect: 'manual'
      });

      console.log('Maintenance check response:', response.status, response.statusText);

      // If we get a 503 status, it's maintenance mode
      if (response.status === 503) {
        const data = await response.json();
        if (data.error === 'maintenance_mode') {
          setIsMaintenanceMode(true);
          setRetryCount(0);
          
          // Don't redirect, just show maintenance page in React
          console.log('Maintenance mode detected, showing React maintenance page');
          return true;
        }
      }

      // If we get a successful response, reset retry count and maintenance mode
      if (response.ok) {
        setIsMaintenanceMode(false);
        setRetryCount(0);
        console.log('Service is healthy, maintenance mode disabled');
        return false;
      }

      // If response is not ok and not 503, it might be an error
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);

    } catch (error) {
      console.warn('Maintenance check failed:', error);
      setError(error.message);
      setRetryCount(prev => prev + 1);
      
      // If we've exceeded retry count, assume maintenance mode
      if (retryCount + 1 >= maxRetryCount) {
        console.log('Max retries exceeded, assuming maintenance mode');
        setIsMaintenanceMode(true);
        
        // Don't redirect, just show maintenance page in React
        console.log('Max retries exceeded, showing React maintenance page');
        return true;
      }
      
      return false;
    } finally {
      setIsChecking(false);
    }
  }, [apiUrl, maintenanceUrl, maxRetryCount, retryCount, autoRedirect]);


  const manualCheck = useCallback(() => {
    return checkMaintenanceStatus();
  }, [checkMaintenanceStatus]);

  const redirectToMaintenance = useCallback(() => {
    window.location.href = maintenanceUrl;
  }, [maintenanceUrl]);

  useEffect(() => {
    // Check immediately
    checkMaintenanceStatus();
    
    // Set up periodic checking
    const interval = setInterval(() => {
      checkMaintenanceStatus();
    }, checkInterval);

    return () => clearInterval(interval);
  }, [checkMaintenanceStatus, checkInterval]);

  // Add a manual reset function for debugging
  const resetMaintenanceMode = useCallback(() => {
    setIsMaintenanceMode(false);
    setRetryCount(0);
    setError(null);
  }, []);

  return {
    isMaintenanceMode,
    isChecking,
    error,
    retryCount,
    manualCheck,
    redirectToMaintenance,
    resetMaintenanceMode
  };
};

export default useMaintenanceMode;
