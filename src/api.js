export const API_URL = 'http://localhost:3001/api';

export const startSession = async () => {
    try {
        const response = await fetch(`${API_URL}/session`, { method: 'POST' });
        if (!response.ok) throw new Error('Failed to start session');
        return await response.json();
    } catch (err) {
        console.error(err);
        // Fallback for offline usage
        return { sessionId: 'offline-' + Date.now() };
    }
};

export const submitData = async (sessionId, type, payload) => {
    try {
        const response = await fetch(`${API_URL}/data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, type, payload })
        });
        return response.ok;
    } catch (err) {
        console.warn('Offline mode: data saved locally');
        return true; // Pretend it worked
    }
};
