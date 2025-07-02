// Enhanced script to test if the server is running on port 3001
const http = require('http');
const net = require('net');

// First, let's check if anything is listening on port 3001 (for both IPv4 and IPv6)
async function checkPortInUse(port) {
  // Check IPv4 first
  const ipv4Result = await checkSpecificAddress(port, '127.0.0.1', 'IPv4');
  
  // Then check IPv6
  const ipv6Result = await checkSpecificAddress(port, '::1', 'IPv6');
  
  return ipv4Result || ipv6Result;
}

// Check a specific address (IPv4 or IPv6)
function checkSpecificAddress(port, address, addressType) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`✓ Port ${port} is in use on ${addressType} (${address}) - something is listening`);
        resolve(true);
      } else {
        console.error(`Error checking ${addressType} port: ${err.message}`);
        resolve(false);
      }
    });
    
    server.once('listening', () => {
      console.log(`✗ Port ${port} is NOT in use on ${addressType} (${address}) - nothing is listening!`);
      server.close();
      resolve(false);
    });
    
    // Use the specific address (IPv4 or IPv6)
    server.listen(port, address);
  });
}

// Try to connect to the NestJS API endpoint (test both IPv4 and IPv6)
async function testApiEndpoint() {
  // Try IPv4 first
  const ipv4Result = await testSpecificEndpoint('127.0.0.1', 'IPv4');
  if (ipv4Result) return true;
  
  // If IPv4 fails, try IPv6
  return await testSpecificEndpoint('::1', 'IPv6');
}

// Test a specific API endpoint (IPv4 or IPv6)
async function testSpecificEndpoint(hostname, addressType) {
  console.log(`\nTesting connection to backend server at http://${hostname}:3001/api (${addressType})...`);
  
  const options = {
    hostname: hostname,
    port: 3001,
    path: '/api',
    method: 'GET',
    timeout: 2000,
  };
  
  return new Promise((resolve) => {
    const req = http.request(options, (res) => {
      console.log(`✓ Connected successfully to ${addressType} endpoint!`);
      console.log(`STATUS: ${res.statusCode}`);
      console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
      
      res.setEncoding('utf8');
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('BODY:', data);
        console.log(`✓ Server is running and accessible on ${addressType}!`);
        resolve(true);
      });
    });

    req.on('error', (e) => {
      console.error(`✗ ERROR: Cannot connect to API endpoint on ${addressType}: ${e.message}`);
      if (e.code === 'ECONNREFUSED') {
        console.error(`✗ The API endpoint is not responding on ${addressType} address ${hostname}:3001.`);
      }
      resolve(false);
    });

    req.on('timeout', () => {
      console.error(`✗ Request to ${addressType} endpoint timed out after 2 seconds.`);
      req.abort();
      resolve(false);
    });

    req.end();
  });
}

async function runTests() {
  console.log('=== BACKEND SERVER DIAGNOSTIC TEST ===');
  console.log(`Testing time: ${new Date().toLocaleTimeString()}`);
  
  // Check if port 3001 is in use
  const portInUse = await checkPortInUse(3001);
  
  // Test API endpoint
  if (portInUse) {
    await testApiEndpoint();
  }
  
  console.log('\n=== DIAGNOSTIC TEST COMPLETE ===');
}

runTests();
