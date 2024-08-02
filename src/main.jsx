import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { PostProvider } from "./Context.tsx";
import "./index.css";

import Navbar from "./routes/Navbar.tsx";
import App from "./routes/Home.tsx";
import Messages from "./routes/Messages.tsx";
import Groupchats from "./routes/Groupchats.tsx";
import Settings from "./routes/Settings.jsx";

const AppRouter = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="messages" element={<Messages />} />
      <Route path="groupchats" element={<Groupchats />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  </Router>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PostProvider>
      <div className="app">
        <AppRouter />
      </div>
    </PostProvider>
  </React.StrictMode>
);