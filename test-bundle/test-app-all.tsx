import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Flag } from "../src/index.ts";

function App() {
  // Using many flags to compare bundle size
  const flags = ["us", "gb", "fr", "de", "jp", "cn", "ru", "in", "br", "au"];

  return (
    <StrictMode>
      <div style={{ padding: "20px" }}>
        <h1>Test Bundle - 10 flags used</h1>
        <Suspense fallback={<div>Loading flags...</div>}>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {flags.map((code) => (
              <Flag key={code} code={code} width={64} height={64} />
            ))}
          </div>
        </Suspense>
      </div>
    </StrictMode>
  );
}

const root = createRoot(document.body);
root.render(<App />);
