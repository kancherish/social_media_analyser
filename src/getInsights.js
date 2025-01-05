export default async function getInsights(keyword) {
    const response = await fetch(
        "https://socialmedia-performance-analyser.onrender.com/runFlow",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputValue: keyword }), // Send selectedType as inputValue
        }
      );

      const data = await response.json(); 

      return data.message
}