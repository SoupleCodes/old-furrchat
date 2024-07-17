import { useState, useEffect, memo } from 'react';
import PostComponent from './PostComponent';

// CSS for Transitions
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import '../styles/PostTransitions.css';

// Create a WebSocket connection to the server
const ws = new WebSocket('wss://server.meower.org');

const DisplayPosts = () => {
  // State to hold the list of posts
  const [posts, setPosts] = useState<any[]>([]);
  // State to hold the list of online users
  const [isOnline, setIsOnline] = useState<string[]>([]);

  useEffect(() => {
    // Function to handle incoming WebSocket messages
    ws.onmessage = (message) => {
      console.log('Received message:', message.data);
      const data = JSON.parse(message.data);

      // Handle new post data
      if (data.val?._id) {
        setPosts((prevPosts) => [data.val, ...prevPosts]);
      } 
      // Handle online user list updates
      else if (data.cmd === "ulist") {
        var users = data.val.split(';');
        users.pop()
        setIsOnline(users);
      } 
      // Handle post updates
      else if (data.cmd === "direct" && data.val.mode === "update_post") {
        const editedPost = data.val.payload;
        const postIndex = posts.findIndex((post) => post._id === editedPost._id);
        if (postIndex !== -1) {
          // Update the specific post in the list
          const updatedPosts = [...posts];
          updatedPosts[postIndex] = editedPost;
          setPosts(updatedPosts);
        }
      } 
      // Handle post deletions
      else if (data.val.mode === "delete") {
        const postIndex = posts.findIndex((post) => post._id === data.val.id);
        if (postIndex !== -1) {
          // Remove the post from the list
          const updatedPosts = [...posts];
          updatedPosts.splice(postIndex, 1);
          setPosts(updatedPosts);
        }
      }
    };

    // Clean up WebSocket on component unmount
    return () => {
      ws.onmessage = null; 
    };
  }, [posts]); // Dependency array ensures effect runs when posts state changes

  useEffect(() => {
    // Function to fetch initial posts from the server
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://api.meower.org/home');
        if (response.ok) {
          const data = await response.json();
          setPosts(data.autoget || []);
        } else {
          console.error('Error fetching posts:', response.statusText);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    fetchPosts();
  }, []); // Empty dependency array ensures effect runs once on mount

  return (
    <TransitionGroup>
      {posts.map((post) => (
        <CSSTransition
          key={post._id || Math.random().toString(36).substring(2, 15)}
          timeout={500}
          classNames="post-transition"
        >
          <PostComponent
            _id={post._id || ''}
            attachments={post.attachments || []}
            isDeleted={post.isDeleted || false}
            post={post.p || ''}
            pinned={post.pinned || false}
            post_id={post.post_id || null}
            post_origin={post.post_origin || null}
            time={post.t ? { e: post.edited_at !== undefined ? post.edited_at : post.t.e } : { e: 0 }}
            type={post.type || 0}
            user={post.u || 'unknown'}
            active={isOnline.includes(post.p.includes(':') && post.u === 'Discord' ? post.p.split(':')[0] : post.u)}
            edited={post.edited_at !== undefined}
            author={undefined}
            reactions={[]}
            reply_to={[]}
          />
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
}

// Memoize the DisplayPosts component to prevent unnecessary re-renders
export default memo(DisplayPosts);
