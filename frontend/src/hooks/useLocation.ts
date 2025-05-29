"use client";

import { useState, useEffect } from 'react';

interface LocationHook {
  location: { lat: number; lng: number } | null;
  error: string | null;
  getLocation: () => void;
  watchLocation: () => () => void;
}

export const useLocation = (): LocationHook => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get current location once
  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setError(null);
      },
      (error) => {
        setError(`Error getting location: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  // Watch location continuously
  const watchLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return () => {};
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setError(null);
      },
      (error) => {
        setError(`Error watching location: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    // Return cleanup function
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  };

  return { location, error, getLocation, watchLocation };
};

export default useLocation;