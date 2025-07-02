// Enhanced debug script to catch unhandled exceptions during server startup
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Create a log file for errors
const logStream = fs.createWriteStream('./startup-error.log', { flags: 'a' });

console.log('Starting backend server with enhanced error logging...');

// Set environment variables
process.env.PORT = '3001';
process.env.NODE_ENV = 'development';

// Load .env file manually
try {
  const envFile = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const [, key, value] = match;
      process.env[key.trim()] = value.trim();
      logStream.write(`[ENV] Loaded: ${key}\n`);
    }
  });
} catch (err) {
  logStream.write(`[ENV ERROR] Failed to load .env: ${err.message}\n`);
}

// Test database connection
async function testDatabaseConnection() {
  if (!process.env.DATABASE_URL) {
    logStream.write(`[DB ERROR] No DATABASE_URL found in environment\n`);
    console.error('No DATABASE_URL found in environment');
    return false;
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    logStream.write(`[DB] Attempting to connect to database...\n`);
    await client.connect();
    
    const result = await client.query('SELECT NOW() as now');
    logStream.write(`[DB] Connected successfully! Server time: ${result.rows[0].now}\n`);
    console.log('✓ Database connection successful');
    
    await client.end();
    return true;
  } catch (err) {
    logStream.write(`[DB ERROR] Database connection failed: ${err.message}\n`);
    console.error(`✗ Database connection failed: ${err.message}`);
    return false;
  }
}

// Log timestamp
logStream.write(`\n\n===== Server startup attempt at ${new Date().toISOString()} =====\n`);

// Main function to run database check and start server
async function run() {
  // First check database connection
  console.log('\nTesting database connection...');
  const dbConnected = await testDatabaseConnection();
  
  if (!dbConnected) {
    console.error('\n❌ Backend server failed to start due to database connection issues.');
    logStream.write('[CRITICAL] Server startup aborted due to database connection failure\n');
    return;
  }
  
  console.log('\nStarting NestJS server...');
  startServer();
}

// Function to start the NestJS server
function startServer() {

  // Spawn NestJS application
  const server = spawn('node', ['dist/src/main.js'], {
    env: process.env,
    stdio: 'pipe'
  });

  // Log standard output
  server.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(output);
    logStream.write(`[STDOUT] ${output}`);
    
    // Check for application startup success message
    if (output.includes('Nest application successfully started')) {
      console.log('\n✅ Backend server started successfully!');
      logStream.write('[SUCCESS] Nest application started successfully\n');
      
      // Test connectivity after server starts
      setTimeout(() => {
        testServerConnectivity();
      }, 1000); // Give it a second to fully initialize
    }
  });

  // Log standard error
  server.stderr.on('data', (data) => {
    const errorOutput = data.toString();
    console.error(`[ERROR] ${errorOutput}`);
    logStream.write(`[STDERR] ${errorOutput}`);
  });

  // Handle process exit
  server.on('exit', (code) => {
    const exitMessage = `Server process exited with code ${code}\n`;
    console.error(exitMessage);
    logStream.write(exitMessage);
    
    if (code !== 0) {
      console.error('\n❌ The server exited abnormally. Check startup-error.log for details.');
    }
    
    logStream.end();
  });

  // Handle process errors
  server.on('error', (error) => {
    const errorMessage = `Failed to start server: ${error.message}\n`;
    console.error(errorMessage);
    logStream.write(errorMessage);
  });
}

// Test if the server is actually accessible
function testServerConnectivity() {
  const http = require('http');
  
  console.log('Testing server connectivity...');
  
  // Try IPv6 first (since that's what the server logs show)
  const options = {
    hostname: '::1',
    port: 3001,
    path: '/api',
    method: 'GET',
    timeout: 2000,
  };
  
  const req = http.request(options, (res) => {
    console.log(`\n✅ API endpoint is accessible! Status: ${res.statusCode}`);
    logStream.write(`[CONNECTIVITY] API endpoint is accessible! Status: ${res.statusCode}\n`);
  });
  
  req.on('error', (e) => {
    console.error(`\n❌ API endpoint not accessible: ${e.message}`);
    logStream.write(`[CONNECTIVITY] API endpoint not accessible: ${e.message}\n`);
    
    // Try IPv4 as fallback
    console.log('Trying IPv4 fallback...');
    testIPv4Connectivity();
  });
  
  req.on('timeout', () => {
    console.error('\n❌ API request timed out');
    logStream.write('[CONNECTIVITY] API request timed out\n');
    req.abort();
  });
  
  req.end();
}

function testIPv4Connectivity() {
  const http = require('http');
  
  const options = {
    hostname: '127.0.0.1',
    port: 3001,
    path: '/api',
    method: 'GET',
    timeout: 2000,
  };
  
  const req = http.request(options, (res) => {
    console.log(`\n✅ IPv4 API endpoint is accessible! Status: ${res.statusCode}`);
    logStream.write(`[CONNECTIVITY] IPv4 API endpoint is accessible! Status: ${res.statusCode}\n`);
  });
  
  req.on('error', (e) => {
    console.error(`\n❌ IPv4 API endpoint not accessible: ${e.message}`);
    logStream.write(`[CONNECTIVITY] IPv4 API endpoint not accessible: ${e.message}\n`);
  });
  
  req.end();
}

// Ensure we catch uncaught exceptions in this script
process.on('uncaughtException', (error) => {
  const uncaughtMessage = `Uncaught exception: ${error.message}\n${error.stack}\n`;
  console.error(uncaughtMessage);
  logStream.write(uncaughtMessage);
});

console.log('Debug script running. Check startup-error.log for detailed error information.');

// Start the process
run();
