#!/usr/bin/env bash
set -e

echo Logging in to Docker Hub...
docker login --username sarathkshatri --password 'Sarath08!!'
echo Pulling the Docker image...
docker pull sarathkshatri/crowd-simulation:v0.0.1
