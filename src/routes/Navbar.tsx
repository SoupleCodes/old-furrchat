import { usePostContext } from "../Context.tsx"
import { useEffect, useState } from "react"
import { handleSubmit } from "../utils/AuthUtils.ts"
import { Outlet, Link } from "react-router-dom"

export default function Navbar() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setLoginSuccess, userToken, setUserToken, setUserData } = usePostContext();
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
          src={"/old-furrchat/assets/Logo.png"}
          alt="logo"
          className="logo"
          height="200"
          style={{ padding: 5 }}
        />
        <div className="login" style={{ borderRadius: '5px' }}>
          <div style={{ boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.5) inset, 0px 0px 4px rgba(0, 0, 0, 0.2)', padding: '10px', borderRadius: '5px' }}>
          <form
  onSubmit={handleSubmit(username, password, userToken, setUserToken, setLoginSuccess, setLoginError)}
  className="login-form"
>
  <div className="username-field"> {/* Wrapper for username field */}
    <img className="username-icon" src="/old-furrchat/assets/icons/UsernameIcon.png" alt="Username icon" height="32"/> {/* Username icon */}
    <label htmlFor="username" className="username-label">Username:</label>
    <input
      type="text"
      id="username"
      name="username"
      placeholder="Enter your username."
      value={username}
      onChange={(event) => setUsername(event.target.value)}
      required
      style={{ boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)', padding: '5px', border: '1px solid #ccc', borderRadius: '3px' }}
    />
  </div>
  <div className="password-field">
    <img className="password-icon" src="/old-furrchat/assets/icons/Passkey.png" alt="Password icon" height="32"/>
    <label htmlFor="password" className="password-label">Password:</label>
    <input
      type="password"
      id="password"
      name="password"
      placeholder="Enter your password."
      autoComplete="current-password"
      value={password}
      onChange={(event) => setPassword(event.target.value)}
      required
      style={{ boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)', padding: '5px', border: '1px solid #ccc', borderRadius: '3px' }}
    />
  </div>
  <input
    type="submit"
    value="Submit"
    className="password-submit"
    style={{
      background: 'linear-gradient(to bottom, #4CAF50, #367c39)',
      boxShadow: 'inset 0 0 5px green',
      color: 'white',
      padding: '5px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      marginLeft: 'auto',
      marginRight: '0',
      fontWeight: "600"
    }}
  /></form>
          </div>
          {loginError && <p style={{ color: 'red', lineHeight: '0px', }}>Login failed. Please try again.</p>}
        </div>
      </div>
      <div className="navbar">
        <div className="navbar-items">
          {/* Navigation bar items */}
          <div id="home" className="navbar-item">
            <Link to="/">Home</Link>
          </div>
          <div id="messages" className="navbar-item">
            <Link to="/messages">Inbox</Link>
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
            className="navbar-search"
            name="search"
          />
        </div>
      </div>
      <Outlet />
    </>
  )
}