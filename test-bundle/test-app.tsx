import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Flag } from "../src/index.ts";

function App() {
  return (
    <StrictMode>
      <div style={{ padding: "20px" }}>
        <h1>Test Bundle - Only 3 flags used</h1>
        <Suspense fallback={<div>Loading flags...</div>}>
          <div style={{ display: "flex", gap: "20px" }}>
            <Flag code="us" width={64} height={64} />
            <Flag code="gb" width={64} height={64} />
            <Flag code="fr" width={64} height={64} />
          </div>
        </Suspense>
      </div>
    </StrictMode>
  );
}

const root = createRoot(document.body);
root.render(<App />);
