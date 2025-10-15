import React from 'react';
import useMaintenanceMode from '../../hooks/useMaintenanceMode';
import MaintenancePage from './MaintenancePage';
import { API_ENDPOINTS } from '../../config/api';

const MaintenanceDetector = ({ 
    children, 
    apiUrl = `${API_ENDPOINTS.base}/health`,
    maintenanceUrl = '/maintenance',
    checkInterval = 30000,
    retryCount = 3,
    autoRedirect = true,
    showNotification = true
}) => {
    const { 
        isMaintenanceMode, 
        isChecking, 
        error, 
        retryCount: currentRetries,
        manualCheck,
        redirectToMaintenance,
        resetMaintenanceMode
    } = useMaintenanceMode({
        apiUrl,
        maintenanceUrl,
        checkInterval,
        retryCount,
        autoRedirect
    });

    // Don't show notification, just render maintenance page directly
    // React.useEffect(() => {
    //     if (isMaintenanceMode && showNotification) {
    //         // Notification logic removed - we just show the maintenance page
    //     }
    // }, [isMaintenanceMode, showNotification]);

    // Show maintenance page if in maintenance mode
    if (isMaintenanceMode) {
        return <MaintenancePage />;
    }

    return (
        <div>
            {children}
        </div>
    );
};

export default MaintenanceDetector;
