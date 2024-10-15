#!/usr/bin/env bash

# Install necessary dependencies for Puppeteer
apt-get update && apt-get install -y \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libgbm-dev \
  libpango1.0-0 \
  xdg-utils \
  wget \
  chromium-browser

# Make Chrome executable path available to Puppeteer
export PUPPETEER_EXECUTABLE_PATH='/usr/bin/chromium-browser'
