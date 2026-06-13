#!/bin/sh
set -e

node /app/stream-proxy/server.mjs &
exec nginx -g 'daemon off;'
