import { Suspense } from "react";
import "./App.css";
import { LoadingIndicator } from "./components/LoadingIndicator";
import { MainPage } from "./pages/MainPage";

function App() {
  return (
    <Suspense fallback={<LoadingIndicator />}>
      <MainPage />
    </Suspense>
  );
}

export default App;
