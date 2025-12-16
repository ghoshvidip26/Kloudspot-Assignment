import axios from 'axios';
import { tokenStore } from './utils';

const API_BASE_URL = 'https://hiring-dev.internal.kloudspot.com/api';

// Create an axios instance with default config
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token
apiClient.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = tokenStore.getState().token;
        
        // If token exists, add it to headers
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log("Config: ",config)
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token expiration
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // If we get a 401 (Unauthorized), the token might be expired
        if (error.response?.status === 401) {
            // Clear the token
            tokenStore.getState().removeToken();
            
            // Redirect to login page
            if (typeof window !== 'undefined') {
                window.location.href = '/';
            }
        }
        
        return Promise.reject(error);
    }
);

// API methods
export const api = {
    // Auth
    login: (email: string, password: string) => 
        apiClient.post('/auth/login', { email, password }),
    getSites: () => 
        apiClient.get('/sites'),
    // Analytics
    getDwellAnalytics: (
        siteId: string,
        fromUtc: number,
        toUtc: number
    ) =>
    apiClient.post('/analytics/dwell', {
        siteId,
        fromUtc,
        toUtc,
    }),
    
    getFootfallAnalytics: () => 
        apiClient.get('/analytics/footfall'),
    
    getDemographics: (siteId: string, fromUtc: number, toUtc: number) => 
        apiClient.post('/analytics/demographics',{
            siteId,
            fromUtc,
            toUtc
        }),
    
    getOccupancyAnalytics: (
        siteId: string,
        fromUtc: number,
        toUtc: number
    ) =>
    apiClient.post('/analytics/occupancy', {
        siteId,
        fromUtc,
        toUtc,
    }),

    getCrowdEntries: (siteId: string,
        fromUtc: number,
        toUtc: number,
        pageSize: number,
        pageNo: number) => 
        apiClient.post('/analytics/entry-exit', {
            siteId,
            fromUtc,
            toUtc,
            pageSize,
            pageNo
        }),
        getFootfall: (siteId: string,
            fromUtc: number,
            toUtc: number) => 
        apiClient.post('/analytics/footfall', {
            siteId,
            fromUtc,
            toUtc
        }),
};

export default apiClient;
