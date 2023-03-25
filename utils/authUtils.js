const validateSignup = (username, email, password, confirmPassword) => {
    const errors = [];
  
    if (!username || !email || !password || !confirmPassword) {
      errors.push('All fields are required');
    }
  
    if (username && (username.length < 3 || username.length > 20)) {
      errors.push('Username must be between 3 and 20 characters');
    }
  
    if (email && !email.includes('@')) {
      errors.push('Invalid email address');
    }
  
    if (password && password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
  
    if (confirmPassword && password !== confirmPassword) {
      errors.push('Passwords do not match');
    }
  
    return errors;
  };
  
  const validateLogin = (email, password) => {
    const errors = [];

    if (!email || !password) {
      errors.push('Email and password are required');
    }
  
    return errors;
}; 
module.exports = { validateSignup}
module.exports ={validateLogin };