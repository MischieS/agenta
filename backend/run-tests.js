const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const TEST_DIR = path.join(__dirname, 'tests');
const DEFAULT_TIMEOUT = 30000; // 30 seconds timeout for tests

// ANSI color codes for pretty output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * Main function to run tests
 */
async function runTests() {
  const args = process.argv.slice(2);
  const specificTests = args.filter(arg => !arg.startsWith('--'));
  
  console.log(`${colors.bright}${colors.blue}===== Agenta Backend Test Runner =====${colors.reset}\n`);
  
  try {
    // Get all test files
    const testFiles = fs.readdirSync(TEST_DIR)
      .filter(file => file.endsWith('.test.js'))
      .filter(file => specificTests.length === 0 || specificTests.includes(file.replace('.test.js', '')));
    
    if (testFiles.length === 0) {
      if (specificTests.length > 0) {
        console.log(`${colors.yellow}No test files found matching: ${specificTests.join(', ')}${colors.reset}`);
      } else {
        console.log(`${colors.yellow}No test files found in ${TEST_DIR}${colors.reset}`);
      }
      return;
    }
    
    console.log(`${colors.cyan}Found ${testFiles.length} test files to run:${colors.reset}`);
    testFiles.forEach(file => console.log(`  - ${file}`));
    console.log('');
    
    // Run Jest for each test file
    let successCount = 0;
    let failureCount = 0;
    
    for (const file of testFiles) {
      const testName = file.replace('.test.js', '');
      console.log(`${colors.bright}${colors.blue}Running tests for: ${testName}${colors.reset}`);
      
      try {
        await runJest(path.join(TEST_DIR, file));
        console.log(`${colors.green}✓ ${testName} tests passed!${colors.reset}\n`);
        successCount++;
      } catch (err) {
        console.error(`${colors.red}✗ ${testName} tests failed!${colors.reset}\n`);
        failureCount++;
      }
    }
    
    // Print summary
    console.log(`${colors.bright}${colors.blue}===== Test Summary =====${colors.reset}`);
    if (successCount > 0) {
      console.log(`${colors.green}✓ ${successCount} test suites passed${colors.reset}`);
    }
    if (failureCount > 0) {
      console.log(`${colors.red}✗ ${failureCount} test suites failed${colors.reset}`);
    }
    
    process.exit(failureCount > 0 ? 1 : 0);
    
  } catch (err) {
    console.error(`${colors.red}Error running tests: ${err.message}${colors.reset}`);
    process.exit(1);
  }
}

/**
 * Run Jest on a specific test file
 */
function runJest(testFile) {
  return new Promise((resolve, reject) => {
    const jest = spawn('npx', ['jest', testFile, '--no-cache'], {
      stdio: 'inherit',
      shell: true
    });
    
    jest.on('close', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Jest process exited with code ${code}`));
      }
    });
    
    jest.on('error', err => {
      reject(new Error(`Failed to start Jest: ${err.message}`));
    });
  });
}

// Run the tests
runTests();
