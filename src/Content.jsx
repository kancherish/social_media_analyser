import { useState } from "react";
import getInsights from "./getInsights";
import Markdown from "react-markdown"

const LoadingSpinner = () => (
  <svg className="inline w-5 h-5 text-white animate-spin" viewBox="0 0 100 101" fill="none">
    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
  </svg>
);

const POST_TYPES = [
  { value: "STATIC_IMG", label: "Static Image" },
  { value: "CAROUSEL", label: "Carousel" },
  { value: "REELS", label: "Reels" },
];

function Content() {
  const [insights, setInsights] = useState("");
  const [isInsightLoading, setInsightLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputValue = formData.get("post-type");
    
    if (!inputValue) return;

    setInsights("");
    setInsightLoading(true);
    
    try {
      const data = await getInsights(inputValue);
      setInsights(data["message"]);
    } catch (error) {
      console.error(error);
      window.alert(error);
    } finally {
      setInsightLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-6">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-xl bg-gray-800 shadow-xl">
          <div className="border-b border-gray-700 p-4">
            <h1 className="text-xl font-semibold text-white">Content Insights</h1>
          </div>

         
          <div className="p-4">
            <div className={`
              h-[60vh] rounded-lg bg-gray-700 p-4
              ${insights ? 'overflow-auto' : 'flex items-center justify-center'}
            `}>
              {isInsightLoading ? (
                <div className="flex items-center gap-3 rounded-lg bg-gray-600 px-6 py-4 text-white">
                  <LoadingSpinner />
                  <span className="font-medium">Analyzing...</span>
                </div>
              ) : insights ? (
                <div className="prose prose-invert max-w-none">
                  {(<Markdown>
                    {insights}
                  </Markdown>)}
                </div>
              ) : (
                <div className="text-gray-400">
                  Select a post type and click "Get Insights" to begin
                </div>
              )}
            </div>


            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
              <select
                name="post-type"
                className="w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2.5 text-sm text-white 
                          placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 sm:w-64"
                defaultValue=""
              >
                <option value="" disabled>Select post type</option>
                {POST_TYPES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              
              <button
                type="submit"
                disabled={isInsightLoading}
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 
                         to-purple-600 px-6 py-2.5 text-sm font-medium text-white transition-all hover:from-blue-600 
                         hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 
                         focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isInsightLoading ? (
                  <>
                    <LoadingSpinner />
                    <span className="ml-2">Processing...</span>
                  </>
                ) : (
                  'Get Insights'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Content;