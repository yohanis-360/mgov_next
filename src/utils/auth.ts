"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Hook to check if a user is authenticated and redirect if not
 * @param redirectPath Path to redirect to if user is not authenticated
 * @param userType Type of user to check for ('user' or 'developer')
 */
export const useRequireAuth = (redirectPath: string, userType: 'user' | 'developer' = 'user') => {
  const router = useRouter();

  useEffect(() => {
    // Check for authentication
    const accessToken = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    
    if (!accessToken || !userData) {
      // User is not logged in, redirect to login page
      router.replace(redirectPath);
      return;
    }

    // Additional check for developer portal
    if (userType === 'developer') {
      try {
        const user = JSON.parse(userData);
        if (user.status !== 'approved') {
          // Developer is not approved, redirect
          router.replace('/developer_portal');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        // If there's an error, redirect to login
        router.replace(redirectPath);
      }
    }
  }, [redirectPath, router, userType]);
};

/**
 * Utility function to handle logout
 * @param router Next.js router instance
 * @param redirectPath Path to redirect to after logout (default: '/user/login')
 */
export const handleLogout = (router: any, redirectPath: string = '/user/login') => {
  // Clear all authentication tokens and user data
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  localStorage.removeItem('data');
  
  // Navigate to login page
  router.push(redirectPath);
};

/**
 * Check if user is authenticated (for client-side usage)
 * @returns Boolean indicating if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const accessToken = localStorage.getItem('access_token');
  const userData = localStorage.getItem('user');
  
  return !!accessToken && !!userData;
};

/**
 * Prevents browser back navigation to authenticated pages after logout
 * This should be called on login pages
 */
export const preventBackNavigation = () => {
  if (typeof window !== 'undefined') {
    // When this page loads after logout, replace the history entry
    // This prevents users from going back to authenticated pages using browser back button
    window.history.pushState(null, '', window.location.href);
    
    // Add a listener for the popstate event (when user clicks back button)
    window.addEventListener('popstate', () => {
      window.history.pushState(null, '', window.location.href);
    });
  }
}; 