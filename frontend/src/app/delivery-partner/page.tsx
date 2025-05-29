"use client";
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Socket instance
let socket: any;

export default function DeliveryPartnerPage() {
  const [status, setStatus] = useState<string>("Idle");
  const [currentCoords, setCurrentCoords] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    try {
      // Connect to Socket.IO server
      socket = io("http://localhost:4001");

      socket.on('connect', () => {
        console.log('Connected to backend as delivery partner');
        setStatus("Connected");
      });

      socket.on('disconnect', () => {
        setStatus("Disconnected");
      });
      
      socket.on('connect_error', (error: any) => {
        console.error('Connection error:', error);
        setStatus(`Connection error: ${error.message}`);
      });
    } catch (error: any) {
      console.error('Socket initialization error:', error);
      setStatus(`Socket error: ${error.message}`);
    }

    // Clean up on component unmount
    return () => {
      if(socket) socket.disconnect();
    };
  }, []);

  const sendLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newCoords = { lat: latitude, lng: longitude };
          setCurrentCoords(newCoords);
          if (socket && socket.connected) {
            socket.emit('send_location', newCoords);
            setStatus(`Location sent: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            console.log('Sent:', newCoords);
          } else {
            setStatus("Not connected to server. Cannot send location.");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setStatus(`Error: ${error.message}`);
        }
      );
    } else {
      setStatus("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <h2>Delivery Partner Simulation</h2>
      <button
        onClick={sendLocation}
        style={{
          padding: '12px 24px',
          border: 'unset',
          borderRadius: '4px',
          color: '#212121',
          zIndex: 1,
          background: '#e8e8e8',
          position: 'relative',
          fontWeight: 1000,
          fontSize: '17px',
          boxShadow: '4px 8px 19px -3px rgba(0,0,0,0.27)',
          transition: 'all 250ms',
          overflow: 'hidden',
          margin: '10px',
          cursor: 'pointer'
        }}
      >
        Send My Current Location
      </button>
      <p>Status: {status}</p>
      {currentCoords && <p>Last Sent: Lat: {currentCoords.lat.toFixed(4)}, Lng: {currentCoords.lng.toFixed(4)}</p>}
    </div>
  );
}