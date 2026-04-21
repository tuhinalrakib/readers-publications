import axios from 'axios';
import { API_ENDPOINTS } from '@/constants/apiEnds';

const apiClient = axios.create();

let isRefreshing = false;
const refreshAndRetryQueue = [];

// Attach token to every request
apiClient.interceptors.request.use((config) => {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
        config.headers['Authorization'] = `Bearer ${access_token}`;
    }
    return config;
}, (error) => Promise.reject(error));

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        console.log(error)
        if (error?.response?.status === 401 && error?.response?.data?.detail === "No active account found with the given credentials") {
            localStorage.clear();
            return Promise.reject(error);
        }

        const originalRequest = error.config;
        const access_token = localStorage.getItem('access_token');

        if (access_token && error?.response?.status === 401) {
            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const refresh_token = localStorage.getItem('refresh_token');
                    if (refresh_token) {
                        const response = await axios.post(`${API_ENDPOINTS.REFRESH_TOKEN}`, {
                            refresh: refresh_token,
                        });

                        const new_access_token = response.data.access;
                        localStorage.setItem('access_token', new_access_token);

                        // Retry all queued requests with the new token
                        refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
                            config.headers['Authorization'] = `Bearer ${new_access_token}`;
                            apiClient.request(config).then(resolve).catch(reject);
                        });

                        refreshAndRetryQueue.length = 0;
                        return apiClient(originalRequest);
                    } else {
                        localStorage.clear();
                        return Promise.reject(null);
                    }
                } catch (refreshError) {
                    localStorage.clear();
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            // Add the request to the retry queue
            return new Promise((resolve, reject) => {
                refreshAndRetryQueue.push({ config: originalRequest, resolve, reject });
            });
        }

        return Promise.reject(error);
    }
);

export default apiClient;
