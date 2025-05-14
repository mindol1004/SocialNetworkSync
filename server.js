#!/usr/bin/env node

// This file is created to make the workflow run
// as the project is transitioning from Vite to Next.js

console.log('Starting Next.js development server...');
require('child_process').spawn('npx', ['next', 'dev'], {
  stdio: 'inherit',
  shell: true
});