// Track last time we logged auth header information to reduce console spam
let lastAuthLog = 0;

export default function authHeader() {
  try {
    const userStr = localStorage.getItem("user");

    // Limit logging frequency to once per minute
    const now = Date.now();
    const shouldLog =
      process.env.NODE_ENV === "development" && now - lastAuthLog > 60000;

    if (!userStr) {
      if (shouldLog) {
        console.warn("No user found in localStorage");
        lastAuthLog = now;
      }
      return {};
    }

    const user = JSON.parse(userStr);

    // Check for token/accessToken in user object - handle different naming conventions
    const token = user?.token || user?.accessToken;

    if (token) {
      if (shouldLog) {
        console.log(`Found valid auth token: ${token.substring(0, 15)}...`);
        lastAuthLog = now;
      }
      return { Authorization: "Bearer " + token };
    } else {
      if (shouldLog) {
        console.warn("User object found but no token/accessToken property");
        lastAuthLog = now;
      }
      return {};
    }
  } catch (error) {
    console.error("Error in authHeader:", error);
    return {};
  }
}
