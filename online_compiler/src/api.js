import axios from "axios";

const API_KEY = "471eddc842msh4a2996200a1e75ap154e42jsn5e2fb83ad7a9";
const BASE_URL = "https://judge0-ce.p.rapidapi.com/";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "x-rapidapi-host": 'judge0-ce.p.rapidapi.com',
    "x-rapidapi-key": API_KEY,
  },
});

export const createSubmission = (code, languageId, input) => {
  return apiClient.post("/submissions", {
    source_code: code,
    language_id: languageId,
    stdin: input,
  });
};

export const getSubmissionResult = (token) => {
  return apiClient.get(`/submissions/${token}`);
};
