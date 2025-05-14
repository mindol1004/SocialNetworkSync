/**
 * Application routes
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FEED: '/home',
  EXPLORE: '/explore',
  MESSAGES: '/messages',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
  PROFILE: (username: string) => `/profile/${username}`,
};

/**
 * Route groups
 */
export const ROUTE_GROUPS = {
  AUTH: [ROUTES.LOGIN, ROUTES.REGISTER],
  PROTECTED: [
    ROUTES.FEED, 
    ROUTES.EXPLORE, 
    ROUTES.MESSAGES, 
    ROUTES.NOTIFICATIONS, 
    ROUTES.SETTINGS
  ],
  PUBLIC: [ROUTES.HOME],
};

/**
 * Check if a route belongs to a specific group
 */
export const isRouteInGroup = (route: string, group: string[]): boolean => {
  // Handle dynamic routes with pattern matching
  if (route.includes('/profile/')) {
    return group.some(groupRoute => 
      groupRoute.startsWith('/profile/')
    );
  }
  
  return group.includes(route);
};