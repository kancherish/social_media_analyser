export default async function getInsights(keyword) {
    try {
        console.log(`${import.meta.env.VITE_API}/${keyword}`)
        const res = await fetch(`${import.meta.env.VITE_API}/${keyword}`);
        return await res.text();
    } catch (error) {
        throw error;
    }
}