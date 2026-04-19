/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {boolean} - True if password meets criteria
 */
export function validatePassword(password) {
  if (password.length < 8) {
    return {
      valid: false,
      reason: "Password must be at least 8 characters long.",
    };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      reason: "Password must contain at least one uppercase letter.",
    };
  }
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      reason: "Password must contain at least one lowercase letter.",
    };
  }
  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      reason: "Password must contain at least one digit.",
    };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      valid: false,
      reason: "Password must contain at least one special character.",
    };
  }
  return { valid: true, reason: "Password meets the criteria." };
}

export function passwordRules() {
  return [
    { label: "At least 8 characters", test: (p) => p.length >= 8 },
    { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
    { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
    { label: "One number", test: (p) => /[0-9]/.test(p) },
    {
      label: "One special character",
      test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
    },
  ];
}
