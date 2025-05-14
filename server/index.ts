// This file is created to make the workflow run
// as the project is transitioning from Vite to Next.js

import { spawn } from 'child_process';

console.log('Starting Next.js development server on port 5000...');
spawn('npx', ['next', 'dev', '-p', '5000'], {
  stdio: 'inherit',
  shell: true
});