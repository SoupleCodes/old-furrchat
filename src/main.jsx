import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { PostProvider } from "./Context.tsx";
import "./index.css";

import Navbar from "./routes/Navbar.tsx";
import App from "./routes/Home.tsx";
import Messages from "./routes/Messages.tsx";

const AppRouter = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="messages" element={<Messages />} />
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