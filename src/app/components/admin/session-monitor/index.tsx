'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { signOut } from 'next-auth/react';

// Configuration constants (must match auth-config.ts)
const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
const ACTIVITY_CHECK_INTERVAL = 60 * 1000; // Check every minute
const SESSION_REFRESH_INTERVAL = 5 * 60 * 1000; // Refresh session every 5 minutes

export default function SessionMonitor() {
  const { data: session, update } = useSession();
  const lastActivityRef = useRef<number>(Date.now());
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const checkTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Track user activity and handle session timeout
  useEffect(() => {
    if (!session) return;

    const updateActivity = () => {
      lastActivityRef.current = Date.now();
    };

    // Listen to various user activities
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      window.addEventListener(event, updateActivity, { passive: true });
    });

    // Refresh session periodically based on activity
    refreshTimerRef.current = setInterval(async () => {
      const timeSinceActivity = Date.now() - lastActivityRef.current;
      
      // Only refresh if user has been active recently (within last 5 minutes)
      if (timeSinceActivity < 5 * 60 * 1000) {
        try {
          // Call the refresh endpoint to update session
          await fetch('/api/auth/session/refresh', {
            method: 'POST',
            credentials: 'include',
          });
          
          // Also trigger NextAuth session update
          await update();
        } catch (error) {
          console.error('Failed to refresh session:', error);
        }
      }
    }, SESSION_REFRESH_INTERVAL);

    // Check for inactivity and logout automatically
    checkTimerRef.current = setInterval(() => {
      const timeSinceActivity = Date.now() - lastActivityRef.current;

      if (timeSinceActivity >= INACTIVITY_TIMEOUT) {
        // Session expired due to inactivity - logout silently
        signOut({ 
          callbackUrl: '/admin/login',
          redirect: true 
        });
      }
    }, ACTIVITY_CHECK_INTERVAL);

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
      if (checkTimerRef.current) {
        clearInterval(checkTimerRef.current);
      }
    };
  }, [session, update]);

  // This component doesn't render anything - it just monitors in the background
  return null;
}

