import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add interceptors for handling auth tokens or errors globally
// apiClient.interceptors.request.use(config => {
//   // Get token from local storage or state management
//   const token = localStorage.getItem('supabase.auth.token'); // Example, adjust as needed
//   if (token) {
//     config.headers.Authorization = `Bearer ${JSON.parse(token).access_token}`;
//   }
//   return config;
// }, error => {
//   return Promise.reject(error);
// });

// apiClient.interceptors.response.use(response => {
//   return response;
// }, error => {
//   // Handle errors globally if needed (e.g., 401 unauthorized)
//   if (error.response && error.response.status === 401) {
//     // Handle unauthorized access, e.g., redirect to login
//     console.error("Unauthorized access - redirecting to login");
//     // window.location.href = '/login'; // Or use react-router navigate
//   }
//   return Promise.reject(error);
// });

export default apiClient;
