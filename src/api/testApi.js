import axios from "axios";
import { API_CONFIG, buildApiUrl } from "../config/api";

// Create axios instance with interceptors for authentication
const apiClient = axios.create();

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 🟢 Create a new test
export const createTest = async (testData) => {
  const response = await apiClient.post(buildApiUrl(API_CONFIG.ENDPOINTS.TESTS.CREATE), testData);
  return response.data;
};

// 🔵 Update a test by testId
export const updateTest = async (testId, updatedData) => {
  const response = await apiClient.put(buildApiUrl(API_CONFIG.ENDPOINTS.TESTS.UPDATE(testId)), updatedData);
  return response.data;
};

// 🟢 Fetch all tests
export const fetchTests = async () => {
  const response = await apiClient.get(buildApiUrl(API_CONFIG.ENDPOINTS.TESTS.ALL));
  return response.data;
};

// 🟢 Fetch questions of a specific test (by testId)
export const fetchQuestions = async (testId) => {
  const response = await apiClient.get(buildApiUrl(API_CONFIG.ENDPOINTS.TESTS.QUESTIONS(testId)));
  return response.data.questions;
};

// 🔵 Update a question by questionId
export const updateQuestion = async (questionId, updatedData) => {
  await apiClient.put(buildApiUrl(API_CONFIG.ENDPOINTS.QUESTIONS.UPDATE(questionId)), updatedData);
};

// 🔴 Delete a question by questionId
export const deleteQuestion = async (questionId) => {
  await apiClient.delete(buildApiUrl(API_CONFIG.ENDPOINTS.QUESTIONS.DELETE(questionId)));
};

// 🟢 Get 20 random questions for a given testName + categoryName
export const getTest = async (testName, categoryName) => {
  const response = await apiClient.get(buildApiUrl(API_CONFIG.ENDPOINTS.TESTS.RANDOM(testName, categoryName)));
  return response.data; // assuming backend returns { randomQuestions: [...] }
};

// 🟢 Fetch overall leaderboard by graduation year with filters
export const fetchOverallLeaderboard = async (graduationYear, filters = {}) => {
  const queryParams = new URLSearchParams();
  
  // Add filters as query parameters if they exist
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== '') {
      queryParams.append(key, value);
    }
  });
  
  const queryString = queryParams.toString();
  const url = queryString 
    ? `${buildApiUrl(API_CONFIG.ENDPOINTS.LEADERBOARD.OVERALL(graduationYear))}?${queryString}`
    : buildApiUrl(API_CONFIG.ENDPOINTS.LEADERBOARD.OVERALL(graduationYear));
  
  const response = await apiClient.get(url);
  return response.data;
};
