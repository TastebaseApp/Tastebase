#!/bin/bash
# Run on the server

set -e

echo "Moving JAR to /home/tastebase..."
sudo mv /tmp/tastebase.jar /home/tastebase/tastebase.jar

echo "Stopping tastebase service..."
sudo systemctl stop tastebase

echo "Starting tastebase service..."
sudo systemctl start tastebase

echo "Deployment complete."