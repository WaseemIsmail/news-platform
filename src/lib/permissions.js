export const ROLES = {
  READER: "reader",
  EDITOR: "editor",
  ADMIN: "admin",
};

export const PERMISSIONS = {
  VIEW_ADMIN_DASHBOARD: "view_admin_dashboard",
  MANAGE_ARTICLES: "manage_articles",
  MANAGE_COMMENTS: "manage_comments",
  MANAGE_CATEGORIES: "manage_categories",
  MANAGE_TAGS: "manage_tags",
  MANAGE_POLLS: "manage_polls",
  MANAGE_TIMELINES: "manage_timelines",
  MANAGE_USERS: "manage_users",
  MANAGE_SETTINGS: "manage_settings",
  VIEW_ANALYTICS: "view_analytics",
  CREATE_ARTICLES: "create_articles",
  EDIT_ARTICLES: "edit_articles",
  DELETE_ARTICLES: "delete_articles",
  MODERATE_COMMENTS: "moderate_comments",
};

export const ROLE_PERMISSIONS = {
  [ROLES.READER]: [],

  [ROLES.EDITOR]: [
    PERMISSIONS.VIEW_ADMIN_DASHBOARD,
    PERMISSIONS.MANAGE_ARTICLES,
    PERMISSIONS.CREATE_ARTICLES,
    PERMISSIONS.EDIT_ARTICLES,
    PERMISSIONS.MANAGE_COMMENTS,
    PERMISSIONS.MODERATE_COMMENTS,
    PERMISSIONS.MANAGE_CATEGORIES,
    PERMISSIONS.MANAGE_TAGS,
    PERMISSIONS.MANAGE_POLLS,
    PERMISSIONS.MANAGE_TIMELINES,
    PERMISSIONS.VIEW_ANALYTICS,
  ],

  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_ADMIN_DASHBOARD,
    PERMISSIONS.MANAGE_ARTICLES,
    PERMISSIONS.CREATE_ARTICLES,
    PERMISSIONS.EDIT_ARTICLES,
    PERMISSIONS.DELETE_ARTICLES,
    PERMISSIONS.MANAGE_COMMENTS,
    PERMISSIONS.MODERATE_COMMENTS,
    PERMISSIONS.MANAGE_CATEGORIES,
    PERMISSIONS.MANAGE_TAGS,
    PERMISSIONS.MANAGE_POLLS,
    PERMISSIONS.MANAGE_TIMELINES,
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_SETTINGS,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
};

export function getUserRole(user) {
  return user?.role || ROLES.READER;
}

export function getPermissionsByRole(role) {
  return ROLE_PERMISSIONS[role] || [];
}

export function hasPermission(userOrRole, permission) {
  const role =
    typeof userOrRole === "string"
      ? userOrRole
      : getUserRole(userOrRole);

  return getPermissionsByRole(role).includes(permission);
}

export function hasAnyPermission(userOrRole, permissions = []) {
  return permissions.some((permission) =>
    hasPermission(userOrRole, permission)
  );
}

export function hasAllPermissions(userOrRole, permissions = []) {
  return permissions.every((permission) =>
    hasPermission(userOrRole, permission)
  );
}

export function isAdmin(userOrRole) {
  const role =
    typeof userOrRole === "string"
      ? userOrRole
      : getUserRole(userOrRole);

  return role === ROLES.ADMIN;
}

export function isEditor(userOrRole) {
  const role =
    typeof userOrRole === "string"
      ? userOrRole
      : getUserRole(userOrRole);

  return role === ROLES.EDITOR;
}

export function canAccessAdmin(userOrRole) {
  return hasPermission(
    userOrRole,
    PERMISSIONS.VIEW_ADMIN_DASHBOARD
  );
}

export function canManageArticles(userOrRole) {
  return hasPermission(
    userOrRole,
    PERMISSIONS.MANAGE_ARTICLES
  );
}

export function canManageComments(userOrRole) {
  return hasPermission(
    userOrRole,
    PERMISSIONS.MANAGE_COMMENTS
  );
}

export function canManageCategories(userOrRole) {
  return hasPermission(
    userOrRole,
    PERMISSIONS.MANAGE_CATEGORIES
  );
}

export function canManageTags(userOrRole) {
  return hasPermission(
    userOrRole,
    PERMISSIONS.MANAGE_TAGS
  );
}

export function canManagePolls(userOrRole) {
  return hasPermission(
    userOrRole,
    PERMISSIONS.MANAGE_POLLS
  );
}

export function canManageTimelines(userOrRole) {
  return hasPermission(
    userOrRole,
    PERMISSIONS.MANAGE_TIMELINES
  );
}

export function canManageUsers(userOrRole) {
  return hasPermission(
    userOrRole,
    PERMISSIONS.MANAGE_USERS
  );
}

export function canManageSettings(userOrRole) {
  return hasPermission(
    userOrRole,
    PERMISSIONS.MANAGE_SETTINGS
  );
}

export function canViewAnalytics(userOrRole) {
  return hasPermission(
    userOrRole,
    PERMISSIONS.VIEW_ANALYTICS
  );
}