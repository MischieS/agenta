const nextJest = require('next/jest')

// Providing the path to your Next.js app which will enable loading next.config.js and .env files
const createJestConfig = nextJest({
  dir: './',
})

// Any custom config you want to pass to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/contexts/(.*)$': '<rootDir>/contexts/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/types/(.*)$': '<rootDir>/types/$1',
    '^@/test-utils/(.*)$': '<rootDir>/test-utils/$1',
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
    '<rootDir>/backend/',
  ],
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    'contexts/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    '!app/api/**',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}

// createJestConfig is exported in this way to ensure that next/jest can load the Next.js configuration
module.exports = createJestConfig(customJestConfig)
