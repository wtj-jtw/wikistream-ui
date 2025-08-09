import React from "react";
import WikiChanges from "./WikiChanges";

function App() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Wikipedia Recent Changes (via WebFlux SSE)</h1>
      <WikiChanges />
    </div>
  );
}

export default App;
