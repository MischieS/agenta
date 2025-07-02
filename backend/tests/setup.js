// Jest setup file to configure global test environment

// Extend the default timeout for all tests
jest.setTimeout(30000);

// Suppress console output during tests to keep the output clean
// Remove these lines if you want to see logs during testing
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Set up any global environment variables needed for tests
process.env.NODE_ENV = 'test';

// Output a message to confirm setup is running
console.log = jest.fn();
console.log('Test environment setup complete');

// Add global teardown to disconnect database connections
afterAll(async () => {
  // Add any global cleanup code here
  console.log('Test environment teardown complete');
});
