#!/usr/bin/env bash
set -e

docker run -d --name crowd-simulation -p 8888:8888 sarathkshatri/crowd-simulation:v0.0.1 --mount src=../node_modules/,target=/app
