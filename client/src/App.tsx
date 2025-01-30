import { lazy, Suspense } from "react";
import Loader from "./HOC/Loader";

function App() {
  const MainPage = lazy(() => import("./components/MainPage"));

  return (
    <div className="flex-start flex-col min-h-screen bg-gray-700">
      <Suspense fallback={<Loader type="global" />}>
        <MainPage />
      </Suspense>
    </div>
  );
}

export default App;
