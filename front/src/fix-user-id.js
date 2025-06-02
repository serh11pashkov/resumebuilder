function fixUserId() {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      console.error("No user found in localStorage. Please login first.");
      return false;
    }

    const user = JSON.parse(userStr);
    console.log(
      "Current user from localStorage:",
      JSON.stringify(user, null, 2)
    );

    if (user.id || user.userId || user._id) {
      console.log(
        "User ID already exists:",
        user.id || user.userId || user._id
      );
      return true;
    }

    const token = user.token || user.accessToken;
    if (!token) {
      console.error("No token found in user object");
      return false;
    }

    let userId = null;

    if (user.sub) userId = user.sub;
    else if (user.id) userId = user.id;
    else if (user.userId) userId = user.userId;
    else if (user._id) userId = user._id;

    if (!userId && user.username) {
      userId = `user-${user.username}-${Date.now()}`;
      console.warn("Created a placeholder user ID:", userId);
    } else if (!userId) {
      userId = `user-${Date.now()}`;
      console.warn("Created a placeholder user ID:", userId);
    }

    user.id = userId;
    user.userId = userId;
    user._id = userId;

    localStorage.setItem("user", JSON.stringify(user));
    console.log(
      "User object updated with ID fields:",
      JSON.stringify(user, null, 2)
    );

    return true;
  } catch (error) {
    console.error("Error fixing user ID:", error);
    return false;
  }
}

const success = fixUserId();
console.log("ID fix " + (success ? "succeeded" : "failed") + ".");
console.log(
  success
    ? "You can now try refreshing the page."
    : "Please try logging out and back in."
);
