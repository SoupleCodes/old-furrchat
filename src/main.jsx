import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { PostProvider } from "./Context.tsx";
import "./index.css";

import Navbar from "./routes/Navbar.tsx";
import App from "./routes/Home.tsx";
import Messages from "./routes/Messages.tsx"


const router = createBrowserRouter([
  {
    path: "/furrchat",
    element: <Navbar />,
    children: [
      {
        path: "", // Use an empty string for the index route
        element: <App />,
      },
      {
        path: "messages",
        element: <Messages />,
      },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PostProvider>
    <div className="app">
    <RouterProvider router={router} />
      </div>
    </PostProvider>
  </React.StrictMode>
);