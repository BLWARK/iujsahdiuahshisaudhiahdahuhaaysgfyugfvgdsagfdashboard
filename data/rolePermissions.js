export const rolePermissions = {
    "Master": [
      "dashboard",
      "post-management",
      "content-management",
      "user-management",
      "analytic",
      "marketing",
      "reports",
    ],
    "Super Admin": [ // Perhatikan spasi!
      "dashboard",
      "post-management",
      "content-management",
      "user-management",
      "marketing",
      "reports",
    ],
    "Editor": ["dashboard", "post-management", "content-management", "user-management", "analytic", "reports"],
    "Contributor": ["dashboard", "post-management"],
  };
  