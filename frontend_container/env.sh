#!/bin/bash

export VITE_BACKEND_URL=$(cat /run/secrets/VITE_BACKEND_URL)
export VITE_LOGOUT_URL_FULL=$(cat /run/secrets/VITE_LOGOUT_URL_FULL)

npm run dev -- --host 0.0.0.0