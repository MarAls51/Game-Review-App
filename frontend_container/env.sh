#!/bin/bash

export VITE_BACKEND_URL=$(cat /run/secrets/VITE_BACKEND_URL)

npm run build
