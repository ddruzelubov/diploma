#!/bin/bash

cd email-server && node index.js &
EMAIL_PID=$!

cd cleaning_service_server && node app.js &
SERVER_PID=$!

sleep 3

cd cleaning_service_client && PORT=5000 HOST=0.0.0.0 DANGEROUSLY_DISABLE_HOST_CHECK=true npm start

wait $SERVER_PID
wait $EMAIL_PID
