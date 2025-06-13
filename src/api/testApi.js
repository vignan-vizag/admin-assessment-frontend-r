import axios from "axios";
import { API_CONFIG, buildApiUrl } from "../config/api";

// 🟢 Create a new test
export const createTest = async (testData) => {
  const response = await axios.post(buildApiUrl(API_CONFIG.ENDPOINTS.TESTS.CREATE), testData);
  return response.data;
};

// 🔵 Update a test by testId
export const updateTest = async (testId, updatedData) => {
  const response = await axios.put(buildApiUrl(API_CONFIG.ENDPOINTS.TESTS.UPDATE(testId)), updatedData);
  return response.data;
};

// 🟢 Fetch all tests
export const fetchTests = async () => {
  const response = await axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.TESTS.ALL));
  return response.data;
};

// 🟢 Fetch questions of a specific test (by testId)
export const fetchQuestions = async (testId) => {
  const response = await axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.TESTS.QUESTIONS(testId)));
  return response.data.questions;
};

// 🔵 Update a question by questionId
export const updateQuestion = async (questionId, updatedData) => {
  await axios.put(buildApiUrl(API_CONFIG.ENDPOINTS.QUESTIONS.UPDATE(questionId)), updatedData);
};

// 🔴 Delete a question by questionId
export const deleteQuestion = async (questionId) => {
  await axios.delete(buildApiUrl(API_CONFIG.ENDPOINTS.QUESTIONS.DELETE(questionId)));
};

// 🟢 Get 20 random questions for a given testName + categoryName
export const getTest = async (testName, categoryName) => {
  const response = await axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.TESTS.RANDOM(testName, categoryName)));
  return response.data; // assuming backend returns { randomQuestions: [...] }
};
