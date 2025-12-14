import { Suspense } from "react";
import { Flag } from "./components/Flag";

export function App() {
  return (
    <div className="app">
      <h1>React Flags with Suspense</h1>
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        <Flag code="ad" width={64} height={64} />
        <Flag code="us-ca" width={64} height={64} />
        <Flag code="gb" width={64} height={64} />
        <Flag code="fr" width={64} height={64} />
        <Flag code="de" width={64} height={64} />
      </div>
    </div>
  );
}

export default App;
