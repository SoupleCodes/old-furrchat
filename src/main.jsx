import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { PostProvider } from "./Context.tsx";
import "./index.css";

import Navbar from "./routes/Navbar.tsx";
import Home from "./routes/Home.tsx";
import Messages from "./routes/Messages.tsx";
import Groupchats from "./routes/Groupchats.tsx";
import Settings from "./routes/Settings.jsx";
import UserPage from "./routes/UserPage.tsx";
import GroupchatPage from "./routes/GroupchatPage.tsx";

const AppRouter = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="messages" element={<Messages />} />
      <Route path="chats" exact element={<Groupchats />} />
      <Route path="chats/:chatId" element={<GroupchatPage />} />
      <Route path="settings" element={<Settings />} />
      <Route path="users/:username" element={<UserPage />} />
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