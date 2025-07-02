/**
 * Shared validation library
 * 
 * This module provides validation functions that can be reused across
 * both frontend and backend code to ensure consistent validation rules.
 */

// Email validation with RFC 5322 compliant regex
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Password validation - at least 8 chars, 1 uppercase, 1 lowercase, 1 number
export const isValidPassword = (password: string): boolean => {
  if (password.length < 8) return false;
  
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  return hasUppercase && hasLowercase && hasNumber;
};

// Name validation - letters, spaces, hyphens, apostrophes, min 2 chars
export const isValidName = (name: string): boolean => {
  if (!name || name.trim().length < 2) return false;
  return /^[a-zA-Z\s'-]+$/.test(name);
};

// Phone validation - allows various international formats
export const isValidPhone = (phone: string): boolean => {
  // Basic international phone validation
  // Allows +country code and various formats with spaces, dashes, or parentheses
  const phoneRegex = /^(?:\+\d{1,3})?[-.\s]?\(?[0-9]{1,4}\)?[-.\s]?[0-9]{1,4}[-.\s]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};

// Helper function to validate required fields
export const isNotEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim() !== '';
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

// Form validation helper
export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

// Generic form validator that takes validation rules and returns validation results
export const validateForm = <T extends Record<string, any>>(
  data: T,
  rules: {
    [K in keyof T]?: (value: T[K]) => boolean | { valid: boolean; message: string };
  }
): ValidationResult => {
  const errors: Record<string, string> = {};
  let valid = true;

  for (const field in rules) {
    if (!Object.prototype.hasOwnProperty.call(rules, field)) continue;

    const rule = rules[field];
    if (!rule) continue;

    const value = data[field];
    const result = rule(value);
    
    if (typeof result === 'boolean') {
      if (!result) {
        errors[field] = `Invalid ${field}`;
        valid = false;
      }
    } else {
      if (!result.valid) {
        errors[field] = result.message;
        valid = false;
      }
    }
  }

  return { valid, errors };
};
