/**
 * Authentication-specific validation rules
 * Uses the shared validation library
 */

import { isValidEmail, isValidPassword, isValidName, ValidationResult, validateForm } from './index';
import { UserData } from '@/types/api';

// Login validation
export interface LoginFormData {
  email: string;
  password: string;
}

export const validateLogin = (data: LoginFormData): ValidationResult => {
  return validateForm(data, {
    email: (value) => ({
      valid: isValidEmail(value),
      message: 'Please enter a valid email address'
    }),
    password: (value) => ({
      valid: value.length > 0,
      message: 'Password is required'
    })
  });
};

// Profile update validation
export type ProfileFormData = Partial<Omit<UserData, 'id' | 'token'>>;

export const validateProfileUpdate = (data: ProfileFormData): ValidationResult => {
  const rules: Record<string, any> = {};
  
  if ('email' in data) {
    rules.email = (value: string) => ({
      valid: isValidEmail(value),
      message: 'Please enter a valid email address'
    });
  }
  
  if ('name' in data) {
    rules.name = (value: string) => ({
      valid: isValidName(value),
      message: 'Name must contain only letters, spaces, hyphens, and apostrophes'
    });
  }
  
  if ('surname' in data) {
    rules.surname = (value: string) => ({
      valid: isValidName(value),
      message: 'Surname must contain only letters, spaces, hyphens, and apostrophes'
    });
  }

  return validateForm(data, rules);
};

// Password change validation
export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const validatePasswordChange = (data: PasswordChangeData): ValidationResult => {
  return validateForm(data, {
    currentPassword: (value) => ({
      valid: value.length > 0,
      message: 'Current password is required'
    }),
    newPassword: (value) => ({
      valid: isValidPassword(value),
      message: 'Password must be at least 8 characters with at least 1 uppercase letter, 1 lowercase letter, and 1 number'
    }),
    confirmPassword: (value) => ({
      valid: value === data.newPassword,
      message: 'Passwords do not match'
    })
  });
};
