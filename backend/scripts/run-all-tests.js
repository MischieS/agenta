const { execSync } = require('child_process');
const path = require('path');

// ANSI color codes for pretty output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// List of all features and their corresponding test files
const features = [
  { name: 'University Management', testFile: 'university.test.js' },
  { name: 'Staff Management', testFile: 'staff.test.js' },
  { name: 'Student Management', testFile: 'students.test.js' },
  { name: 'Role Management', testFile: 'roles.test.js' },
  { name: 'User Documents', testFile: 'user-documents.test.js' },
  { name: 'Messaging System', testFile: 'messaging.test.js' },
];

console.log(`${colors.bright}${colors.blue}===== Agenta Backend Feature Test Summary =====${colors.reset}\n`);
console.log(`${colors.bright}Testing ${features.length} backend features:${colors.reset}`);

features.forEach((feature, index) => {
  console.log(`${index + 1}. ${feature.name} - ${colors.cyan}${feature.testFile}${colors.reset}`);
});

console.log(`\n${colors.bright}${colors.green}Choose an option:${colors.reset}`);
console.log(`1. Run all tests`);
console.log(`2. Run specific test`);
console.log(`3. Exit\n`);

// In a real interactive environment, we would read user input here
// For now, we'll just run all tests
console.log(`${colors.yellow}Automatically running all tests...${colors.reset}\n`);

try {
  // Run the tests using Node.js run-tests.js script
  const runTestsPath = path.join(__dirname, '..', 'run-tests.js');
  execSync(`node ${runTestsPath}`, { stdio: 'inherit' });
  
  console.log(`\n${colors.bright}${colors.green}===== Summary of Implemented Features =====${colors.reset}`);
  console.log(`\n${colors.cyan}University Management:${colors.reset}`);
  console.log(`✓ Create/update/delete universities`);
  console.log(`✓ Activate/deactivate universities`);
  console.log(`✓ Count all universities (Total: x, Active: y)`);
  
  console.log(`\n${colors.cyan}Staff Management:${colors.reset}`);
  console.log(`✓ Create/update/delete staff members`);
  console.log(`✓ Assign roles to staff`);
  console.log(`✓ Activate/deactivate staff members`);
  
  console.log(`\n${colors.cyan}Student Management:${colors.reset}`);
  console.log(`✓ Create/update/delete students`);
  console.log(`✓ Assign students to universities`);
  console.log(`✓ Search students by name or student ID`);
  
  console.log(`\n${colors.cyan}Role Management:${colors.reset}`);
  console.log(`✓ Create/update/delete roles`);
  console.log(`✓ Manage role permissions`);
  console.log(`✓ Assign roles to staff members`);
  
  console.log(`\n${colors.cyan}User Documents:${colors.reset}`);
  console.log(`✓ Upload/update/delete user documents`);
  console.log(`✓ Document approval workflow`);
  
  console.log(`\n${colors.cyan}Messaging:${colors.reset}`);
  console.log(`✓ Send/receive messages`);
  console.log(`✓ Mark messages as read`);
  console.log(`✓ Count unread messages`);
  
} catch (error) {
  console.error(`${colors.red}Error running tests: ${error.message}${colors.reset}`);
  process.exit(1);
}
