# Bhavya Express

A full-stack, production-ready Pan-India delivery/logistics web application with a premium, animated UI.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS v4, React Router, Framer Motion, Recharts
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Authentication**: JWT
- **Payments**: Razorpay (Mock fallback included)

## Setup Instructions

### 1. Database Setup
Ensure you have MongoDB running locally on `mongodb://127.0.0.1:27017/` or update the `MONGO_URI` in `.env` files and `seed.js`.

### 2. Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Copy the environment variables: `cp .env.example .env`
4. Seed the database with sample data: `npm run seed`
5. Start the backend server: `npm run dev`

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the Vite dev server: `npm run dev`

## Test Credentials
- **Admin**: `admin@bhavyaexpress.com` / `password123`
- **Customer**: `customer@test.com` / `password123`
- **Sample Tracking ID**: `BHV1000001` (Check MongoDB or Admin dashboard for others)

## Notes
- Payments will fall back to a mock flow if Razorpay keys are not provided.
- OTP verification is simulated (enter any 6 digits).
