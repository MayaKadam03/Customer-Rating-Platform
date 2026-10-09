/**
 * Validation utility functions following spec constraints
 */

// Name: Min 20 characters, Max 60 characters
function validateName(name) {
  if (!name || typeof name !== 'string') return 'Name is required.';
  const trimmed = name.trim();
  if (trimmed.length < 20 || trimmed.length > 60) {
    return 'Name must be between 20 and 60 characters in length.';
  }
  return null;
}

// Email: Standard email regex validation
function validateEmail(email) {
  if (!email || typeof email !== 'string') return 'Email is required.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Please provide a valid email address.';
  }
  return null;
}

// Password: 8-16 characters, at least 1 uppercase letter and 1 special character
function validatePassword(password) {
  if (!password || typeof password !== 'string') return 'Password is required.';
  if (password.length < 8 || password.length > 16) {
    return 'Password must be between 8 and 16 characters in length.';
  }
  const hasUppercase = /[A-Z]/.test(password);
  if (!hasUppercase) {
    return 'Password must contain at least one uppercase letter.';
  }
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);
  if (!hasSpecialChar) {
    return 'Password must contain at least one special character.';
  }
  return null;
}

// Address: Max 400 characters
function validateAddress(address) {
  if (!address || typeof address !== 'string') return 'Address is required.';
  if (address.trim().length > 400) {
    return 'Address cannot exceed 400 characters.';
  }
  return null;
}

// Rating: 1 to 5
function validateRating(rating) {
  const numericRating = Number(rating);
  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    return 'Rating must be an integer between 1 and 5.';
  }
  return null;
}

module.exports = {
  validateName,
  validateEmail,
  validatePassword,
  validateAddress,
  validateRating
};
