import './App.css'
import React from 'react';
import MyComponent from './components.tsx';
import { useState } from 'react';
import EmojiPicker from './components/emojipicker.tsx'; 
// @ts-ignore
import { client } from "https://esm.sh/jsr/@meower/api-client@1.0.0-rc.4"
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import ImageRenderer from './components.tsx'
import Dropdown from './components/dropdown.tsx';

var userToken: string // State variable for userToken

export default function App() {
  const [username, setUsername] = useState(''); // State variable for username
  const [password, setPassword] = useState(''); // State variable for password
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [post, setPost] = useState(''); // State variable for post
  const [selectionEnd, setSelectionEnd] = useState(0);
  const [selectionStart, setSelectionStart] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const headingOptions = [
    { label: 'Heading 1', value: '#' },
    { label: 'Heading 2', value: '##' },
    { label: 'Heading 3', value: '###' },
    { label: 'Heading 4', value: '####' },
    { label: 'Heading 5', value: '#####' },
    { label: 'Heading 6', value: '######' }
  ];  

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
          .then(json => {if (json.success) {}});
          setPost('')
  };
    
  const appendToPost = (string: string) => {
    const selectedText = post.substring(selectionStart, selectionEnd);
    const newPost = post.substring(0, selectionStart) + string + selectedText + post.substring(selectionEnd);
    setPost(newPost);
  };

  const handleMarkdownClick = (markdown: string, wrap = true) => {
    const selectedText = post.substring(selectionStart, selectionEnd);
    let newPost = post;
    let newCursorPosition = selectionStart + markdown.length;
  
    if (wrap) {
      newPost = post.substring(0, selectionStart) + 
                 markdown + selectedText + markdown + 
                 post.substring(selectionEnd);
      newCursorPosition += selectedText.length + markdown.length; 
    } else {
      newPost = markdown + selectedText;
      newCursorPosition += markdown.length;
  }
  
  
    setPost(newPost); 
    setSelectionStart(newCursorPosition);
    setSelectionEnd(newCursorPosition);
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
      <div className="markdown-container">
        <EmojiPicker onEmojiSelect={appendToPost} />
        
<div className="markdown-button" onClick={() => handleMarkdownClick('**')}> 
  <img src="/furrchat/assets/markdown/Bold.png" alt="Bold" className="emoji-icon" height="48" title="Bold"/>
</div>

<div className="markdown-button" onClick={() => handleMarkdownClick('~~')}>
  <img src="/furrchat/assets/markdown/Strikethrough.png" alt="strikethrough" height="48" title="Strikethrough"/>
</div>

<div className="markdown-button" onClick={() => handleMarkdownClick('*')}>
  <img src="/furrchat/assets/markdown/Italic.png" alt="italic" height="48" title="Italic"/>
</div>

  <Dropdown 
  options={headingOptions} 
  onSelect={(option: any) => handleMarkdownClick(option.value + ' ', false)} 
/>

<div className="markdown-button" onClick={() => handleMarkdownClick('\n - ', false)}> 
  <img src="/furrchat/assets/markdown/UnorderedList.png" alt="unorderedlist" height="48" title="Unordered List"/>
</div>

<div className="markdown-button" onClick={() => handleMarkdownClick('\n1. - ', false)}> 
  <img src="/furrchat/assets/markdown/OrderedList.png" alt="orderedlist" height="48" title="Ordered List"/>
</div>

<div className="markdown-button" onClick={() => handleMarkdownClick('- [] ', false)}>
  <img src="/furrchat/assets/markdown/Checklist.png" alt="checklist" height="48" title="Quote"/>
</div>

<div className="markdown-button" onClick={() => handleMarkdownClick('> ', false)}>
  <img src="/furrchat/assets/markdown/Quote.png" alt="quote" height="48" title="Quote"/>
</div>

<div className="markdown-button" onClick={() => handleMarkdownClick('\n``` \n')}>
  <img src="/furrchat/assets/markdown/Code.png" alt="code" height="48" title="Code"/>
</div>

<div className="markdown-button" onClick={() => handleMarkdownClick('\n| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n| Cell 3   | Cell 4   |', false)}>
  <img src="/furrchat/assets/markdown/Table.png" alt="table" height="48" title="Link"/>
</div>

<div className="markdown-button" onClick={() => handleMarkdownClick('[link description](link)', false)}>
  <img src="/furrchat/assets/markdown/Link.png" alt="link" height="48" title="Link"/>
</div>

<div className="markdown-button" onClick={() => handleMarkdownClick('![image description](image link)', false)}>
  <img src="/furrchat/assets/markdown/Image.png" alt="link" height="48" title="Image"/>
</div>

<div className="markdown-button" onClick={() => setShowPreview(!showPreview)}>
  <img src="/furrchat/assets/markdown/Preview.png" alt="preview" height="48" title="Preview (Alpha)"/>
</div>

  </div>

      <span className="userpost" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      
  {showPreview? (
    <div style={{ flex: 1, 
      margin: '0px 20px',
      width: '900px',
      paddingBottom: '35px',
      minHeight: '50px',
      background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.507) 0%, rgba(230, 230, 230, 0.5) 100%)',
      boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.5), -5px -5px 10px rgba(206, 206, 206, 0.3)',
      borderRadius: '7px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'black',
      padding: '10px'
      }} 
      >
        <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const inline = !match;
            return !inline && match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, '')} // @ts-expect-error
                style={dark} 
                language={match[1]}
                PreTag="div"
                {...props}
                inline={inline}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          // @ts-ignore
          img: ImageRenderer, // Tell ReactMarkdown to use ImageRenderer for img tags
        }}
      >{post}
      </ReactMarkdown>
      </div>) 
   :(
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
        onSelect={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          setSelectionStart(e.target.selectionStart);
          setSelectionEnd(e.target.selectionEnd);
        }}      
    />
    <button type="submit" style={{ whiteSpace: 'nowrap' }}>Post</button>
  <div>
      </div>
  </form>
  )
    
  }

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