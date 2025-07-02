import {
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidPhone,
  isNotEmpty,
} from '../index';

// Add Jest type definitions
import '@testing-library/jest-dom';

describe('Validation Utilities', () => {
  describe('isValidEmail', () => {
    it('should validate correct email formats', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@example.co.uk')).toBe(true);
      expect(isValidEmail('user123@sub.example.org')).toBe(true);
    });

    it('should reject incorrect email formats', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('userexample.com')).toBe(false);
      expect(isValidEmail('user@example')).toBe(false);
      expect(isValidEmail('user@.com')).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('should validate passwords that meet requirements', () => {
      expect(isValidPassword('password123')).toBe(true);
      expect(isValidPassword('Password@123')).toBe(true);
      expect(isValidPassword('a very long password')).toBe(true);
    });

    it('should reject passwords that are too short', () => {
      expect(isValidPassword('')).toBe(false);
      expect(isValidPassword('pass')).toBe(false);
      expect(isValidPassword('12345')).toBe(false);
    });
  });

  describe('isValidName', () => {
    it('should validate proper names', () => {
      expect(isValidName('John')).toBe(true);
      expect(isValidName('Mary Jane')).toBe(true);
      expect(isValidName('O\'Neill')).toBe(true);
    });

    it('should reject invalid names', () => {
      expect(isValidName('')).toBe(false);
      expect(isValidName('a')).toBe(false); // Too short
      expect(isValidName('123')).toBe(false); // Numbers only
    });
  });

  describe('isValidPhone', () => {
    it('should validate proper phone numbers', () => {
      expect(isValidPhone('+1 555-123-4567')).toBe(true);
      expect(isValidPhone('555-123-4567')).toBe(true);
      expect(isValidPhone('(555) 123-4567')).toBe(true);
      expect(isValidPhone('5551234567')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(isValidPhone('')).toBe(false);
      expect(isValidPhone('abc')).toBe(false);
      expect(isValidPhone('123')).toBe(false); // Too short
    });
  });

  describe('isNotEmpty', () => {
    it('should validate when value is present', () => {
      expect(isNotEmpty('text')).toBe(true);
      expect(isNotEmpty(0)).toBe(true);
      expect(isNotEmpty(false)).toBe(true);
      expect(isNotEmpty([])).toBe(true);
      expect(isNotEmpty({})).toBe(true);
    });

    it('should reject when value is missing', () => {
      expect(isNotEmpty('')).toBe(false);
      expect(isNotEmpty(null)).toBe(false);
      expect(isNotEmpty(undefined)).toBe(false);
    });
  });
});
