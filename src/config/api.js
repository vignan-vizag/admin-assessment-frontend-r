// API Configuration - Single source of truth for all API endpoints
export const API_CONFIG = {
  BASE_URL: 'http://localhost:4000',
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

// Helper function to build complete URL
export const buildApiUrl = (endpoint) => {
  return `${API_CONFIG.API_BASE}${endpoint}`;
};

// Export for easy access
export default API_CONFIG;
