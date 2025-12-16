# API Authentication Guide

## Problem Solved

You were getting "Invalid or expired token" errors when calling protected API endpoints like `/api/analytics/dwell`. This was because:

1. ✅ Login was working (after changing from `username` to `email`)
2. ❌ The authentication token wasn't being stored properly
3. ❌ Protected API calls weren't including the Bearer token in headers

## Solution Implemented

### 1. Created API Utility (`app/utils/api.ts`)

This utility provides:
- **Automatic token injection**: Adds `Authorization: Bearer <token>` to all requests
- **Token expiration handling**: Redirects to login on 401 errors
- **Centralized API methods**: Clean interface for all API calls

### 2. Updated Login Component

- Now uses the `api.login()` method
- Stores the JWT token in localStorage
- Cleaner, more maintainable code

### 3. Created Example Component

`AnalyticsExample.tsx` shows how to fetch authenticated data

## How to Use

### Making Authenticated API Calls

```tsx
import { api } from '../utils/api';

// In your component
const fetchData = async () => {
    try {
        // The Bearer token is automatically added!
        const response = await api.getDwellAnalytics();
        console.log(response.data);
    } catch (error) {
        console.error('API error:', error);
    }
};
```

### Available API Methods

```tsx
// Auth
api.login(email, password)

// Analytics
api.getDwellAnalytics()
api.getFootfallAnalytics()
api.getDemographics()
```

### Adding New API Endpoints

Edit `app/utils/api.ts` and add new methods:

```tsx
export const api = {
    // ... existing methods
    
    // Add your new endpoint
    getNewEndpoint: () => 
        apiClient.get('/your/endpoint'),
};
```

### Using the Example Component

Add to any page to test the API:

```tsx
import AnalyticsExample from '../components/AnalyticsExample';

export default function Page() {
    return (
        <div>
            <AnalyticsExample />
        </div>
    );
}
```

## Testing the Fix

1. **Login** with valid credentials
2. The token is automatically stored in localStorage
3. Navigate to any page that uses the API
4. All requests will include the Bearer token automatically
5. If the token expires, you'll be redirected to login

## Key Features

✅ **Automatic Authentication**: No need to manually add headers  
✅ **Token Management**: Handles storage and expiration  
✅ **Error Handling**: Graceful handling of auth errors  
✅ **Type Safety**: TypeScript support  
✅ **Maintainable**: All API logic in one place  

## Next Steps

1. Replace any direct `axios` or `fetch` calls with the `api` utility
2. Add more API methods as needed
3. Update components to use the new API methods
4. Test all protected endpoints

## Example: Before vs After

### Before ❌
```tsx
const response = await axios.get('https://hiring-dev.internal.kloudspot.com/api/analytics/dwell', {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    }
});
```

### After ✅
```tsx
const response = await api.getDwellAnalytics();
```

Much cleaner and the token is handled automatically!
