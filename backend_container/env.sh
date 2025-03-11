#!/bin/bash

export STEAM_API_KEY=$(cat /run/secrets/STEAM_API_KEY)
export TWITCH_API_KEY=$(cat /run/secrets/TWITCH_API_KEY)
export TWITCH_CLIENT_KEY=$(cat /run/secrets/TWITCH_CLIENT_KEY)
export FRONTEND_URL=$(cat /run/secrets/FRONTEND_URL)
export BACKEND_URL=$(cat /run/secrets/BACKEND_URL)
export OPENAI_API_KEY=$(cat /run/secrets/OPENAI_API_KEY)
export MONGO_DB=$(cat /run/secrets/MONGO_DB)
export SESSION_SECRET=$(cat /run/secrets/SESSION_SECRET)
export AUTHORITY=$(cat /run/secrets/AUTHORITY)
export CLIENT_ID=$(cat /run/secrets/CLIENT_ID)
export REDIRECT_URL=$(cat /run/secrets/REDIRECT_URL)
export RESPONSE_TYPE=$(cat /run/secrets/RESPONSE_TYPE)
export LOGOUT_URL=$(cat /run/secrets/LOGOUT_URL)
export SCOPE=$(cat /run/secrets/SCOPE)

npm start
