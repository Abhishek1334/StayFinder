import { useState } from "react";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import router from "./router";
import RouterErrorBoundary from "./components/RouterErrorBoundary";
import { ChevronDown, ChevronUp } from "lucide-react";

function App() {
  const [showNote, setShowNote] = useState(false);

  return (
    <RouterErrorBoundary>
      <RouterProvider router={router} />

      {/* Floating Recruiter Note (Collapsible) */}
      <div className="fixed bottom-4 right-4 z-50 w-80 text-sm">
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <button
            onClick={() => setShowNote(!showNote)}
            className="w-full px-4 py-2 flex items-center justify-between text-left bg-gray-100 hover:bg-gray-200 transition"
          >
            <span className="font-semibold text-gray-800">
              🎯 Recruiter Quick Start
            </span>
            {showNote ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {showNote && (
            <div className="p-4">
              <p className="mb-2 text-gray-700">Use the following test credentials:</p>
              <ul className="list-disc pl-5 mb-3 space-y-1 text-gray-700">
                <li><strong>Email:</strong> <code>sarah@example.com</code></li>
                <li><strong>Password:</strong> <code>password123</code></li>
              </ul>
              <p className="mb-2 text-gray-700">You can test:</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Search filters for listings</li>
          <li>Book a listing from its detail page</li>
          <li>View your bookings on My Bookings page</li>
          <li>View or edit your listings on My Listings page</li>
          <li>Pay using <code>4242 4242 4242 4242</code> (Stripe test card) and any future dates </li>
          <li>Create/update listings</li>
          <li>View Bookings for your hosted listings on Host Bookings page</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <Toaster position="top-right" />
    </RouterErrorBoundary>
  );
}

export default App;
