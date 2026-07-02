#!/bin/bash

# Kill existing processes on ports 8080 and 3000
echo "Cleaning up existing processes..."
fuser -k 8080/tcp 2>/dev/null
fuser -k 3000/tcp 2>/dev/null
pkill -f "spring-boot" 2>/dev/null
pkill -f "next-dev" 2>/dev/null
# Give a moment for ports to be released
sleep 2

# Start Backend
echo "Starting Backend (Spring Boot)..."
cd backend
mvn spring-boot:run > backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend started with PID $BACKEND_PID"

# Start Frontend
echo "Starting Frontend (Next.js)..."
cd ../frontend
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend started with PID $FRONTEND_PID"

echo "--------------------------------------------------"
echo "KSM Real Estate Platform is starting up!"
echo "Backend: http://localhost:8080"
echo "Frontend: http://localhost:3000"
echo "Check backend.log and frontend.log for details."
echo "Press Ctrl+C to stop both services."
echo "--------------------------------------------------"

# Wait for both processes
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT TERM
wait
