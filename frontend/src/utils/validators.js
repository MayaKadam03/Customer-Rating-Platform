export function validateName(name) {
  if (!name || !name.trim()) return 'Name is required.';
  const len = name.trim().length;
  if (len < 20) return `Name must be at least 20 characters (current: ${len}).`;
  if (len > 60) return `Name cannot exceed 60 characters (current: ${len}).`;
  return '';
}

export function validateEmail(email) {
  if (!email || !email.trim()) return 'Email is required.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) return 'Please enter a valid email address.';
  return '';
}

export function validatePassword(password) {
  if (!password) return 'Password is required.';
  if (password.length < 8 || password.length > 16) {
    return `Password must be 8-16 characters (current: ${password.length}).`;
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter.';
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
    return 'Password must contain at least one special character.';
  }
  return '';
}

export function validateAddress(address) {
  if (!address || !address.trim()) return 'Address is required.';
  if (address.trim().length > 400) {
    return `Address cannot exceed 400 characters (current: ${address.trim().length}).`;
  }
  return '';
}
