/**
 * Worker Entry Point
 * 
 * Starts the background job worker for processing queued jobs
 * Run this file to start the worker process: node worker.js
 */

import 'dotenv/config';
import { startWorker } from './workers/signin-notification.worker';

console.log('🚀 Starting Background Job Worker...');
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Redis: ${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`);
console.log(`Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
console.log('');

// Start the worker
startWorker();

console.log('✅ Worker started successfully');
console.log('Press Ctrl+C to stop');
