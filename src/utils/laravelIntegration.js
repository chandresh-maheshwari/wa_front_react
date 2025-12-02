// Utility functions for Laravel-React integration

/**
 * Generates a Laravel redirect URL for React CMS
 * @param {string} baseUrl - The base URL of your React app
 * @param {string} redirectPath - The path to redirect to after authentication (optional)
 * @returns {string} - The complete Laravel redirect URL
 */
export const generateLaravelRedirectUrl = (baseUrl = window.location.origin, redirectPath = '/Dashboard') => {
    const reactUrl = `${baseUrl}/cms/laravel-redirect`;
    const params = new URLSearchParams({
        redirect: redirectPath
    });
    
    return `${reactUrl}?${params.toString()}`;
};

/**
 * Checks if the current user is authenticated via Laravel session
 * @returns {Promise<boolean>} - True if authenticated, false otherwise
 */
export const isLaravelAuthenticated = async () => {
    try {
        const response = await fetch('/api/check-laravel-auth', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'include'
        });
        
        const data = await response.json();
        return data.status === true;
    } catch (error) {
        console.error('Error checking Laravel authentication:', error);
        return false;
    }
};

/**
 * Gets the current Laravel user session data
 * @returns {Promise<Object|null>} - User data if authenticated, null otherwise
 */
export const getLaravelUserData = async () => {
    try {
        const response = await fetch('/api/check-laravel-auth', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'include'
        });
        
        const data = await response.json();
        return data.status === true ? data.user : null;
    } catch (error) {
        console.error('Error getting Laravel user data:', error);
        return null;
    }
};

/**
 * Validates a Laravel session token and returns React token
 * @param {string} laravelToken - The Laravel session token
 * @returns {Promise<Object>} - Response with status and token/user data
 */
export const validateLaravelSession = async (laravelToken) => {
    try {
        const response = await fetch('/api/validate-laravel-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ laravel_token: laravelToken })
        });
        
        return await response.json();
    } catch (error) {
        console.error('Error validating Laravel session:', error);
        throw new Error('Failed to validate Laravel session');
    }
}; 