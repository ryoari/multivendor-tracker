"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import io from 'socket.io-client';

// Socket instance
let socket: any;

// Dynamically import the map component to avoid SSR issues
const DeliveryMap = dynamic(() => import('./map-component'), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center">Loading map...</div>
});

export default function CustomerTrackingPage() {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState<string>("Connecting...");
  
  useEffect(() => {
    // Connect to Socket.IO server
    try {
      socket = io("http://localhost:4001"); // Updated port to 4001
      
      socket.on('connect', () => {
        console.log('Connected to backend for tracking');
        setStatus("Connected to tracking service");
      });
      
      socket.on('location_update', (data: { lat: number; lng: number }) => {
        console.log('Received location update:', data);
        setPosition(data);
        setStatus(`Location updated: ${data.lat.toFixed(4)}, ${data.lng.toFixed(4)}`);
      });
      
      socket.on('disconnect', () => {
        setStatus("Disconnected from server");
      });
      
      socket.on('connect_error', (error: any) => {
        console.error('Connection error:', error);
        setStatus(`Connection error: ${error.message}`);
      });
    } catch (error) {
      console.error('Socket initialization error:', error);
      setStatus(`Socket initialization error`);
    }
    
    // Clean up on component unmount
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order Tracking</h1>
      
      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        <p><strong>Status:</strong> {status}</p>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Delivery Partner Location</h2>
        <div className="h-[500px] w-full">
          <DeliveryMap position={position} defaultCenter={[20.5937, 78.9629]} />
        </div>
        
        <div className="mt-4">
          {position ? (
            <p className="text-center">
              Current Location: Lat: {position.lat.toFixed(4)}, Lng: {position.lng.toFixed(4)}
            </p>
          ) : (
            <p className="text-center">Waiting for delivery partner's location...</p>
          )}
        </div>
      </div>
    </div>
  );
}