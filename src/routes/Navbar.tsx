import { usePostContext } from "../Context.tsx"
import { useEffect, useState } from "react"
import { handleSubmit } from "../utils/AuthUtils.ts"
import { Outlet, Link } from "react-router-dom"

export default function Navbar() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loginSuccess, setLoginSuccess, userToken, setUserToken, setUserData } = usePostContext();
  const [loginError, setLoginError] = useState(false);
  
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("userData");
      const parsedData = storedData ? JSON.parse(storedData) : {}; 
      setUserData(parsedData);
  
      if (Object.keys(parsedData).length === 0) { 
        setLoginSuccess(false);
      } else if (parsedData.token) {
        setUserToken(parsedData.token); 
        setLoginSuccess(true);
  
        const ws = new WebSocket(
          `wss://server.meower.org/?v=1&token=${parsedData.token}` 
        );
  
        ws.onmessage = (message) => {
          const data = JSON.parse(message.data);
          if (data.cmd === "auth") {
            const userData = data.val;
            setUserToken(userData.token);
            setLoginSuccess(true);
            console.log(userData);
            localStorage.setItem("userData", JSON.stringify(userData));
          }
        };
  
        return () => {
          // Close the WebSocket connection when the component unmounts
          ws.close();
        };
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
  }, [setUserToken, loginSuccess]); // Include dependencies for useEffect
  

        
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
              <Outlet />
          </>
          )
}