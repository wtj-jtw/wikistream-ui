import React, { useEffect, useState, useRef } from "react";

export default function WikiChanges() {
  const [events, setEvents] = useState([]);
  const esRef = useRef(null);

  useEffect(() => {
    // point to backend SSE endpoint (adjust hostname/port as needed)
    const url = "http://localhost:8080/api/changes";
    const es = new EventSource(url);
    esRef.current = es;

    es.onopen = () => {
      console.log("Connected to SSE stream");
    };

    es.onerror = (err) => {
      console.error("SSE error", err);
      // EventSource auto-reconnects by default; you may want to show UI
    };

    // You can either use event.type mapping or generic onmessage
    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        // keep newest at top, limit to 100 items
        setEvents(prev => {
          const next = [data, ...prev];
          return next.slice(0, 100);
        });
      } catch (err) {
        console.error("error parsing event data", err);
      }
    };

    return () => {
      es.close();
      esRef.current = null;
    };
  }, []);

  return (
    <div>
      <p>Live edits — newest first:</p>
      <div style={{ maxHeight: "60vh", overflow: "auto", border: "1px solid #ddd", padding: 8 }}>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {events.map((e, idx) => (
            <li key={idx} style={{ padding: 8, borderBottom: "1px solid #eee" }}>
              <div style={{ fontWeight: 600 }}>{e.title || "(no title)"}</div>
              <div style={{ fontSize: 12, color: "#555" }}>
                {e.user} — {e.type} — {e.server_url}
                {e.comment ? ` — ${e.comment}` : ""}
              </div>
              <div style={{ fontSize: 11, color: "#888" }}>
                {new Date((e.timestamp || Date.now()) * 1000).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
