export default async function getInsights(keyword) {
    try {
        const res = await fetch(`https://social-media-analyzer-backend.onrender.com/insights/${keyword}`);
        
        return await res.text();
    } catch (error) {
        throw error;
    }
}