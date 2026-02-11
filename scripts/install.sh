#!/bin/bash
cd /vercel/share/v0-project
npm install --legacy-peer-deps 2>&1
echo "npm install completed with exit code: $?"
