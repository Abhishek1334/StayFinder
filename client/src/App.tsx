import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import router from "./router";
import RouterErrorBoundary from "./components/RouterErrorBoundary";

function App() {
  return (
    <RouterErrorBoundary>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </RouterErrorBoundary>
  );
}

export default App; 