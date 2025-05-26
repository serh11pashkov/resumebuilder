// Direct BCrypt password encoder for Spring Security
// This script generates a BCrypt encoded password compatible with Spring Security
const bcrypt = require("bcryptjs");

// Settings to match Spring Security's BCryptPasswordEncoder
const SALT_ROUNDS = 10; // Spring Security default is 10

// The password to encode
const password = "admin123";

// Generate the encoded password
const encodedPassword = bcrypt.hashSync(password, SALT_ROUNDS);

console.log(`\nPassword: ${password}`);
console.log(`BCrypt encoded password: ${encodedPassword}`);
console.log("\nSQL to update admin password:");
console.log(
  `UPDATE users SET password = '${encodedPassword}' WHERE username = 'admin';`
);
console.log(
  "\nRemember to restart the backend server after updating the password!"
);
