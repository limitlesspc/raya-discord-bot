#!/bin/sh
until xvfb-run -s "-ac -screen 0 1024x1024x24" pnpm start
do
    echo "Restarting bot..."
    sleep 1
done