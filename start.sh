#!/bin/bash

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$ROOT_DIR/email-server" && node index.js &
EMAIL_PID=$!

cd "$ROOT_DIR/cleaning_service_server" && node app.js &
SERVER_PID=$!

sleep 3

cd "$ROOT_DIR/cleaning_service_client" && PORT=5000 HOST=0.0.0.0 DANGEROUSLY_DISABLE_HOST_CHECK=true npx react-scripts start

wait $SERVER_PID
wait $EMAIL_PID
