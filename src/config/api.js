// API Configuration - Single source of truth for all API endpoints
export const API_CONFIG = {
  BASE_URL: 'http://ec2-54-89-201-245.compute-1.amazonaws.com:4000/',
  API_VERSION: '/api',
  
  // Get the complete API base URL
  get API_BASE() {
    return `${this.BASE_URL}${this.API_VERSION}`;
  },
  
  // Specific endpoint builders
  ENDPOINTS: {
    // Tests endpoints
    TESTS: {
      CREATE: '/tests/create',
      ALL: '/tests/all',
      BY_ID: (id) => `/tests/${id}`,
      UPDATE: (id) => `/tests/${id}`,
      DELETE: (id) => `/tests/${id}`,
      STATUS: (id) => `/tests/${id}/status`,
      QUESTIONS: (id) => `/tests/${id}/questions`,
      RANDOM: (testName, categoryName) => `/tests/get-random/${testName}/${categoryName}/`
    },
    
    // Questions endpoints
    QUESTIONS: {
      UPDATE: (id) => `/tests/questions/${id}`,
      DELETE: (id) => `/tests/questions/${id}`,
      ADD: '/questions/add'
    }
  }
};

// Frontend Configuration - Single source of truth for frontend URLs
export const FRONTEND_CONFIG = {
  BASE_URL: 'http://ec2-54-172-203-36.compute-1.amazonaws.com:5173/',
  
  // Frontend route builders
  ROUTES: {
    HOME: '/',
    DASHBOARD: '/dashboard',
    MY_TESTS: '/MyTests',
    MANAGE_TESTS: '/manage-tests',
    UPDATE_QUESTIONS: '/update-questions',
    QUIZ: '/quiz',
    START_TEST: '/start-test'
  },
  
  // Helper to build complete frontend URLs
  getFullUrl: (route) => {
    return `${FRONTEND_CONFIG.BASE_URL}${route}`;
  }
};

// Helper function to build complete API URL
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.API_BASE}${endpoint}`;
};

// Helper function to build complete frontend URL
export const buildFrontendUrl = (route) => {
  return FRONTEND_CONFIG.getFullUrl(route);
};

// Export for easy access
export default API_CONFIG;
