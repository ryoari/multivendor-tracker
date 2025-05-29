# Multivendor Tracker

A real-time delivery tracking system for multiple vendors and delivery partners.

## Features

- Vendor dashboard for managing orders and assigning delivery partners
- Delivery partner interface for updating location
- Customer tracking page with real-time map updates
- Authentication for vendors and delivery partners

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, Socket.IO
- Maps: Leaflet

## Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

The backend server will run on port 4001.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on port 3000.

## Usage

1. Register as a vendor or delivery partner
2. Login with your credentials
3. Vendors can assign delivery partners to orders
4. Delivery partners can update their location
5. Customers can track their orders in real-time