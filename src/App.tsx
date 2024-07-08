import './App.css'
import React from 'react';
const MyComponent = React.lazy(() => import('./components.tsx'));
import { useState } from 'react';
import EmojiPicker from './components/emojipicker.tsx'; 
import '@meower-media/api-client'
import { client } from '@meower-media/api-client';

var username = "Souple"
var password = "emeka100"

const opts = {
  username: username,
  password: password,
  api_url: "https://api.meower.org",
  socket_url: "wss://server.meower.org",
  uploads_url: "https://uploads.meower.org"
}

const c = await client.login(opts)
 // @ts-ignore
c.socket.on('create_message', console.log)

var userToken: string // State variable for userToken

export default function App() {
  const [username, setUsername] = useState(''); // State variable for username
  const [password, setPassword] = useState(''); // State variable for password
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [post, setPost] = useState(''); // State variable for post
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    fetch("https://api.meower.org/auth/login", {
      method: "POST",body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },})
      .then(response => response.json())
      .then(json => {

        if (json.token) {
          userToken = json.token;setLoginSuccess(true);setLoginError(false);
        } else {
        setLoginSuccess(false);setLoginError(true);}});
  }

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
    
  const handleEmojiSelect = (emoji: string) => {
      setPost(post + emoji);
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
      width: '1100px',
      paddingBottom: '35px',
      height: '50px',
      background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.507) 0%, rgba(230, 230, 230, 0.5) 100%)',
      boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.5), -5px -5px 10px rgba(206, 206, 206, 0.3)',
      borderRadius: '7px' }} 
  />
  <button type="submit" style={{ whiteSpace: 'nowrap' }}>Post</button>
<div>
    </div>
</form>

</span>
<div className="markdown-container">
{/* <EmojiPicker onEmojiSelect={handleEmojiSelect} /> */}
</div>

    <span className="" style={{ display: 'flex', justifyContent: 'left', paddingLeft: 20 }}>
    {loginSuccess === false && <p>You're not logged in yet!</p>}
      </span>
      <div className="posts">
        <MyComponent />
      </div>
  </div>
  );
}