import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to track and store the last visited page
 * This hook should be used in the main App component or a layout component
 */
export const useLastVisitedPage = () => {
  const location = useLocation();

  useEffect(() => {
    // Don't store login or register pages as last visited
    if (!location.pathname.includes('/login') && !location.pathname.includes('/register')) {
      localStorage.setItem('lastVisitedPage', location.pathname);
      console.log('Last visited page stored:', location.pathname);
    }
  }, [location.pathname]);
};

export default useLastVisitedPage;
