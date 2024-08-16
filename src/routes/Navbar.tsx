import { usePostContext } from "../Context.tsx"
import { useEffect, useState } from "react"
import { handleSubmit } from "../utils/AuthUtils.ts"
import { Outlet, Link } from "react-router-dom"

export default function Navbar() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loginSuccess, setLoginSuccess, userToken, setUserToken, setUserData } = usePostContext();
  const [loginError, setLoginError] = useState(false);
  const [, setInboxCount] = useState(0);

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    const parsedData = storedData ? JSON.parse(storedData) : {};
    setUserData(parsedData);

    if (Object.keys(parsedData).length === 0) {
      setLoginSuccess(false);
      return;
    }

    if (parsedData.token) {
      setUserToken(parsedData.token);
      setLoginSuccess(true);

      const ws = new WebSocket(`wss://server.meower.org/?v=1&token=${parsedData.token}`);

      ws.onmessage = (message) => {
        try {
          const data = JSON.parse(message.data);
          if (data.cmd === "auth") {
            const userData = data.val;
            setUserToken(userData.token);
            setLoginSuccess(true);

            setUserData(userData);
            localStorage.setItem("userData", JSON.stringify(userData));
            console.log(userData)

            setInboxCount(userData.account.unread_inbox)
            if (userData.account.unread_inbox) {
              const notificationIndicator: HTMLElement | null = document.querySelector(".notification-indicator");
              if (notificationIndicator) {
                notificationIndicator.style.display = "block";
              }
            } else {
              const notificationIndicator: HTMLElement | null = document.querySelector(".notification-indicator");
              if (notificationIndicator) {
                notificationIndicator.style.display = "none";
              }
            }
          }
        } catch (error) {
          console.error("Error parsing message data:", error);
        }
      };

      return () => {
        ws.close();
      };
    }
  }, [setUserToken, setUserData, setLoginSuccess, setInboxCount]);

  return (
    <>
      <div className="banner">
        <img
          src={"/furrchat/assets/Logo.png"}
          alt="logo"
          className="logo"
          height="200"
          style={{ padding: 5 }}
        />
        <div className="login">
          <form
            onSubmit={handleSubmit(
              username,
              password,
              userToken,
              setUserToken,
              setLoginSuccess,
              setLoginError
            )}
          >
            <label htmlFor="username">Username: </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username."
              value={username} // Controlled input for username
              onChange={(event) => setUsername(event.target.value)} // Update state on change
              required
            />
            {"   |   "}
            <label htmlFor="password">Password: </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password."
              autoComplete="current-password"
              value={password} // Controlled input for password
              onChange={(event) => setPassword(event.target.value)} // Update state on change
              required
            />
            <input type="submit" value="Submit" className="password-submit" />{" "}
          </form>
          {loginError && <p>Login failed. Please try again.</p>}
          {loginSuccess && <p>Login successful!</p>}
        </div>
      </div>
      <div className="navbar">
        <div className="navbar-items">
          {/* Navigation bar items */}
          <div id="home" className="navbar-item">
            <Link to="/">Home</Link>
          </div>
          <div id="messages" className="navbar-item">
            <Link to="/messages">Messages</Link>
            <span className="notification-indicator"></span>
          </div>
          <div id="groupchats" className="navbar-item">
            <Link to="/chats">Groupchats</Link>
          </div>
          <div id="settings" className="navbar-item">
            <Link to="/settings">Settings</Link>
          </div>
          <input
            type="text"
            placeholder=" ⌕ Search home posts!"
            name="search"
          />{" "}
          {/* Search input */}
        </div>
      </div>
      <Outlet />
    </>
  )
}