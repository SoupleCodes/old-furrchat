import './App.css'
import MyComponent from './components.tsx';
import { useState } from 'react';

var userToken: string // State variable for userToken

export default function App() {
  const [username, setUsername] = useState(''); // State variable for username
  const [password, setPassword] = useState(''); // State variable for password
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    fetch("https://api.meower.org/auth/login", {
      method: "POST",body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },})
      .then(response => response.json())
      .then(json => {if (json.token) {userToken = json.token;setLoginSuccess(true);setLoginError(false);

      } else {setLoginSuccess(false);setLoginError(true);}});}

      const [post, setPost] = useState(''); // State variable for post
      const sendPost = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); 
        fetch("https://api.meower.org/home", {
          method: "POST",
          body: JSON.stringify({
            "attachments": [
              
            ],
            "content": post
          }),
          headers: { 
            "Content-Type": "application/json",
            "Token": userToken // Token in header
          },
        })
          .then(response => response.json())
          .then(json => {if (json.success) {setPost('');}});
      };
    
  
  return (
    <div className="app">
      <div className="banner">
      <img src={"/furrchat/assets/Logo.png"} alt="logo" className="logo" height="200" style={{ padding: 5 }}></img>
      <div className="login">
      <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <input type="submit" value="Submit"/>
        </form>
        {loginError && <p>Login failed. Please try again.</p>}
        {loginSuccess && <p>Login successful!</p>}
        </div>
      </div>
      <div className="navbar">
        <div className="navbar-items">
        <div id="home" className="navbar-item"><a>Home</a></div>
        <div id="messages" className="navbar-item"><a>Messages</a></div>
        <div id="groupchats" className="navbar-item"><a>Groupchats</a></div>
        <div id="settings" className="navbar-item"><a>Settings</a></div>
        <input type="text" placeholder=" ⌕ Search home posts!" name-="search"></input>
        </div>
      </div>
      <span className="userpost" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form onSubmit={sendPost} style={{ display: 'flex' }}>
  <textarea 
    value={post} 
    onChange={(e) => setPost(e.target.value)} 
    placeholder="What's on your mind?" 
    style={{ flex: 1, 
      marginRight: '5px',
      width: '1105px',
      maxHeight: '150px',
      background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.507) 0%, rgba(230, 230, 230, 0.5) 100%)',
      boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.5), -5px -5px 10px rgba(206, 206, 206, 0.3)',
      borderRadius: '7px' }} 
  />
  <button type="submit" style={{ whiteSpace: 'nowrap' }}>Post</button>
</form>
</span>
    <span className="" style={{ display: 'flex', justifyContent: 'left', paddingLeft: 20 }}>
    {loginSuccess === false && <p>You're not logged in yet!</p>}
      </span>
      <div className="posts">
        <MyComponent />
      </div>
      </div>
  );
}