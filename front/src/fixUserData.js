export function fixUserData() {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      console.log("No user data to fix");
      return;
    }

    const user = JSON.parse(userStr);
    console.log("Checking user data:", user);

    let isFixed = false;

    if (!user.id && (user.userId || user._id)) {
      user.id = user.userId || user._id;
      isFixed = true;
    }

    if (!user.userId && (user.id || user._id)) {
      user.userId = user.id || user._id;
      isFixed = true;
    }

    if (!user._id && (user.id || user.userId)) {
      user._id = user.id || user.userId;
      isFixed = true;
    }

    if (!user.id && !user.userId && !user._id && user.username) {
      const tempId = `user-${user.username}-${Date.now()}`;
      user.id = tempId;
      user.userId = tempId;
      user._id = tempId;
      isFixed = true;
    }

    if (!user.roles) {
      user.roles = ["ROLE_USER"];
      isFixed = true;
    } else if (!Array.isArray(user.roles)) {
      user.roles = [user.roles];
      isFixed = true;
    }

    if (isFixed) {
      console.log("Fixed user data:", user);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      console.log("User data is fine, no fixes needed");
    }
  } catch (error) {
    console.error("Error fixing user data:", error);
  }
}
