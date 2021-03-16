#!/bin/bash
COUNT=$(docker ps -a | grep -c crowd-simulation)
if [ $COUNT -eq 0 ]; then
    echo 'container does not exist'

elif [ $COUNT -ne 0 ]; then
    docker rm -f crowd-simulation &>/dev/null && echo 'Removed old container'
    sleep 30
fi
