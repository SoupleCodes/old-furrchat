import { useState } from "react";
import "./styles/MarkdownEditor.css";
import "./styles/Markdown.css";
import "./styles/Post.css";
import "./App.css";
import MyComponent from "./components/DisplayPosts.tsx";
import PostEditor from "./components/MarkdownEditor.tsx";
import { handleSubmit } from "./utils/AuthUtils"; // Import the handleSubmit function
import UListBody from "./components/Ulist.tsx";

// Import the client from a remote URL
// @ts-ignore
import { client } from "https://esm.sh/jsr/@meower/api-client@1.0.0-rc.4";

export default function App() {
  // State hooks to manage username, password, login success, and login error
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState(false);

  return (
    <div className="app">
      <div className="banner">
        {/* Display logo */}
        <img
          src={"/furrchat/assets/Logo.png"}
          alt="logo"
          className="logo"
          height="200"
          style={{ padding: 5 }}
        />
        <div className="login">
          {/* Login form */}
          <form
            onSubmit={handleSubmit(
              username,
              password,
              setLoginSuccess,
              setLoginError
            )}
          >
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username} // Controlled input for username
              onChange={(event) => setUsername(event.target.value)} // Update state on change
              required
            />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password} // Controlled input for password
              onChange={(event) => setPassword(event.target.value)} // Update state on change
              required
            />
            <input type="submit" value="Submit" /> {/* Submit button */}
          </form>
          {/* Conditional rendering of login messages */}
          {loginError && <p>Login failed. Please try again.</p>}
          {loginSuccess && <p>Login successful!</p>}
        </div>
      </div>
      <div className="navbar">
        <div className="navbar-items">
          {/* Navigation bar items */}
          <div id="home" className="navbar-item">
            <a>Home</a>
          </div>
          <div id="messages" className="navbar-item">
            <a>Messages</a>
          </div>
          <div id="groupchats" className="navbar-item">
            <a>Groupchats</a>
          </div>
          <div id="settings" className="navbar-item">
            <a>Settings</a>
          </div>
          <input
            type="text"
            placeholder=" ⌕ Search home posts!"
            name="search"
          />{" "}
          {/* Search input */}
        </div>
      </div>
      <UListBody />
      <PostEditor userToken={localStorage.getItem("userToken") || ""} />{" "}
      {/* Post editor component */}
      {!loginSuccess && (
        <p style={{ display: "flex", justifyContent: "left", paddingLeft: 20 }}>
          You're not logged in yet!
        </p>
      )}{" "}
      {/* Message when not logged in */}
      <div className="posts">
        <MyComponent /> {/* Component to display posts */}
      </div>
    </div>
  );
}
