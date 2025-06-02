const user = JSON.parse(localStorage.getItem("user"));

console.log("USER OBJECT INSPECTION");
console.log("=====================");
console.log("User exists in localStorage:", !!user);

if (user) {
  console.log("Full user object:", JSON.stringify(user, null, 2));
  console.log("\nKEY PROPERTIES CHECK");
  console.log("-------------------");
  console.log("id property:", user.id);
  console.log("userId property:", user.userId);
  console.log("_id property:", user._id);
  console.log("username:", user.username);
  console.log("email:", user.email);
  console.log(
    "token:",
    user.token ? `${user.token.substring(0, 20)}...` : undefined
  );
  console.log(
    "accessToken:",
    user.accessToken ? `${user.accessToken.substring(0, 20)}...` : undefined
  );
  console.log("roles:", JSON.stringify(user.roles));
}

if (user && !user.id && !user.userId && !user._id) {
  console.error("ERROR: User object exists but has no ID field!");
  console.log("\nPOSSIBLE SOLUTIONS:");
  console.log("1. Log out and log in again");
  console.log("2. Clear localStorage and log in again");
  console.log("3. Fix the auth response structure in the backend");
}

console.log("\nTo resolve issues automatically, run fix-user-id.js script");
