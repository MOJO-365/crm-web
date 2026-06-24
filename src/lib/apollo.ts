import { ApolloClient, InMemoryCache, ApolloLink, Observable } from '@apollo/client';
import { print } from 'graphql';
import axios, { AxiosError } from 'axios';
import { getAccessToken } from '@/lib/auth';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from 'react-toastify';

const getApiUrl = () => {
    const rawUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:4000');
    // Just strip trailing slashes, but KEEP the /graphql prefix if provided as it's needed for the proxy
    return rawUrl.replace(/\/+$/, '');
};

export const BASE_API_URL = getApiUrl();

// Shared axios instance for all API requests
const axiosInstance = axios.create({
    baseURL: BASE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000, // 30 second timeout
});

// Add auth interceptor
axiosInstance.interceptors.request.use((config: any) => {
    // Replace /graphql with /api for REST endpoints
    if (!config.isGraphql && config.baseURL?.endsWith('/graphql')) {
        config.baseURL = config.baseURL.replace(/\/graphql$/, '/api');
    }

    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        // Handle 401 - token expired or security restriction
        if (error.response?.status === 401) {
            const errorData: any = error.response?.data;
            const configData = typeof error.config?.data === 'string' ? JSON.parse(error.config.data) : error.config?.data;
            const operationName = configData?.operationName;

            // Check both standard REST error and GraphQL error formats
            const isIpRestricted = errorData?.error === 'IP restricted' || 
                                  errorData?.errors?.[0]?.message === 'IP restricted';

            if (isIpRestricted) {
                toast.error('Security Alert: Access denied from this IP address. Please log in from an authorized location.', {
                    toastId: 'ip-restricted-error',
                    autoClose: 10000
                });
            } else if (operationName === 'Me') {
                // Only show session expired for the initial 'Me' query to avoid spamming
                toast.warn('Session expired. Please log in again.', {
                    toastId: 'auth-error',
                });
            }

            console.warn(`Authentication error in ${operationName || 'request'} - logging out`);
            
            // Trigger store logout which clears tokens and redirects
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);

// Custom Apollo Link using axios
const axiosLink = new ApolloLink((operation) => {
    return new Observable((observer) => {
        const { query, variables, operationName } = operation;

        axiosInstance
            .post(BASE_API_URL.endsWith('/graphql') ? '' : '/graphql', {
                query: print(query),
                variables,
                operationName,
            }, {
                isGraphql: true
            } as any)
            .then((response) => {
                observer.next(response.data);
                observer.complete();
            })
            .catch((error: AxiosError) => {
                observer.error(error);
            });
    });
});

// Apollo Client instance with optimized cache
export const apolloClient = new ApolloClient({
    link: axiosLink,
    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    // Pagination merge policies
                    customers: {
                        keyArgs: ['search', 'status'],
                        merge(_existing, incoming) {
                            return incoming;
                        },
                    },
                    users: {
                        keyArgs: ['search', 'status'],
                        merge(_existing, incoming) {
                            return incoming;
                        },
                    },
                    ratePlans: {
                        keyArgs: false,
                        merge(_existing, incoming) {
                            return incoming;
                        },
                    },
                },
            },
            // Enable automatic cache ID generation
            Customer: { keyFields: ['uid'] },
            User: { keyFields: ['uid'] },
            RatePlan: { keyFields: ['uid'] },
            RateOffer: { keyFields: ['uid'] },
        },
    }),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first',
        },
        query: {
            fetchPolicy: 'cache-first',
            errorPolicy: 'all',
        },
        mutate: {
            errorPolicy: 'all',
        },
    },
    // Enable query batching
    queryDeduplication: true,
});

// Export axios instance for non-GraphQL API calls
export const apiAxios = axiosInstance;

// Secondary API instance
const secondaryApiUrl = import.meta.env.PROD || true ? 'https://goserv.gsync.com.au/api' : (import.meta.env.VITE_SECOND_API_URL || 'http://localhost:8080');
export const secondaryApiAxios = axios.create({
    baseURL: secondaryApiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

// Add auth interceptor to secondary instance
// secondaryApiAxios.interceptors.request.use((config) => {
//     // const token = getAccessToken();
//     // if (token) {
//     //     config.headers.Authorization = `Bearer ${token}`;
//     // }
//     return config;
// });

// Add response interceptor to secondary instance
// secondaryApiAxios.interceptors.response.use(
//     (response) => response,
//     (error: AxiosError) => {
//         if (error.response?.status === 401) {
//             console.warn('Authentication error on secondary API - token may be expired');
//         }
//         return Promise.reject(error);
//     }
// );
