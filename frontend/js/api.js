const API_URL = 'http://localhost:5000/api';

async function fetchAPI(endpoint, options = {}) {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // If uploading files, remove Content-Type to let browser set boundary
    if (options.body instanceof FormData) {
        delete headers['Content-Type'];
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }
    return data;
}

const API = {
    login: (credentials) => fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (details) => fetchAPI('/auth/register', { method: 'POST', body: JSON.stringify(details) }),
    getMe: () => fetchAPI('/auth/me'),
    getComplaints: (params = '') => fetchAPI(`/complaints${params}`),
    getComplaint: (id) => fetchAPI(`/complaints/${id}`),
    createComplaint: (details) => fetchAPI('/complaints', { method: 'POST', body: JSON.stringify(details) }),
    updateStatus: (id, statusData) => fetchAPI(`/complaints/${id}/status`, { method: 'PUT', body: JSON.stringify(statusData) }),
    assignComplaint: (id, assignData) => fetchAPI(`/complaints/${id}/assign`, { method: 'PUT', body: JSON.stringify(assignData) }),
    getAnalyticsOverview: () => fetchAPI('/analytics/overview'),
    getDepartments: () => fetchAPI('/public/departments'),
    getCategories: () => fetchAPI('/public/categories')
};
