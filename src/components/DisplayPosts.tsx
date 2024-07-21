import { useState, useEffect, memo } from "react";
import PostComponent from "./PostComponent";

// CSS for Transitions
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "../styles/PostTransitions.css";

// Create a WebSocket connection to the server
const ws = new WebSocket("wss://server.meower.org");

const DisplayPosts = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState<string[]>([]);

  useEffect(() => {
    ws.onmessage = (message) => {
      console.log("Received message:", message.data);
      const data = JSON.parse(message.data);

      if (data.val?._id) {
        setPosts((prevPosts) => [data.val, ...prevPosts]);
      } else if (data.cmd === "ulist") {
        var users = data.val.split(";");
        users.pop();
        setIsOnline(users);
      } else if (data.cmd === "direct" && data.val.mode === "update_post") {
        const editedPost = data.val.payload;
        const postIndex = posts.findIndex(
          (post) => post._id === editedPost._id
        );
        if (postIndex !== -1) {
          const updatedPosts = [...posts];
          updatedPosts[postIndex] = editedPost;
          setPosts(updatedPosts);
        }
      } else if (data.val.mode === "delete") {
        const postIndex = posts.findIndex((post) => post._id === data.val.id);
        if (postIndex !== -1) {
          const updatedPosts = [...posts];
          updatedPosts.splice(postIndex, 1);
          setPosts(updatedPosts);
        }
      } else if (
        data.cmd === "direct" &&
        data.val.mode === "post_reaction_add"
      ) {
        const { payload } = data.val;
        const { post_id, emoji } = payload;

        // Find the post in the posts state
        const postIndex = posts.findIndex((post) => post.post_id === post_id);
        if (postIndex !== -1) {
          const updatedPosts = [...posts];
          const updatedPost = { ...updatedPosts[postIndex] };

          // Update or add the reaction count for the emoji
          let found = false;
          updatedPost.reactions = updatedPost.reactions.map((reaction:any) => {
            if (reaction.emoji === emoji) {
              found = true;
              return {
                ...reaction,
                count: reaction.count + 1,
              };
            }
            return reaction;
          });

          // If emoji not found, add it as a new reaction
          if (!found) {
            updatedPost.reactions.push({
              emoji,
              count: 1,
              user_reacted: false,
            });
          }

          // Update the state with the modified post
          updatedPosts[postIndex] = updatedPost;
          setPosts(updatedPosts);
        }
      } else if (
        data.cmd === "direct" &&
        data.val.mode === "post_reaction_remove"
      ) {
        const { payload } = data.val;
        const { post_id, emoji } = payload;

        // Find the post in the posts state
        const postIndex = posts.findIndex((post) => post.post_id === post_id);
        if (postIndex !== -1) {
          const updatedPosts = [...posts];
          const updatedPost = { ...updatedPosts[postIndex] };

          // Update or remove the reaction count for the emoji
          updatedPost.reactions = updatedPost.reactions
            .map((reaction:any) => {
              if (reaction.emoji === emoji) {
                const updatedReaction = {
                  ...reaction,
                  count: reaction.count - 1,
                };
                // Remove the reaction if count goes to 0
                if (updatedReaction.count <= 0) {
                  return null; // returning null will remove this reaction from the array
                } else {
                  return updatedReaction;
                }
              }
              return reaction;
            })
            .filter(Boolean); // Filter out null reactions

          // Update the state with the modified post
          updatedPosts[postIndex] = updatedPost;
          setPosts(updatedPosts);
        }
      }
    };

    return () => {
      ws.onmessage = null;
    };
  }, [posts]);

  useEffect(() => {
    // Function to fetch initial posts from the server
    const fetchPosts = async () => {
      try {
        const response = await fetch("https://api.meower.org/home");
        if (response.ok) {
          const data = await response.json();
          setPosts(data.autoget || []);
        } else {
          console.error("Error fetching posts:", response.statusText);
        }
      } catch (error) {
        console.error("An error occurred:", error);
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
            _id={post._id || ""}
            attachments={post.attachments || []}
            isDeleted={post.isDeleted || false}
            post={post.p || ""}
            pinned={post.pinned || false}
            post_id={post.post_id || null}
            post_origin={post.post_origin || null}
            time={
              post.t
                ? {
                    e: post.edited_at !== undefined ? post.edited_at : post.t.e,
                  }
                : { e: 0 }
            }
            type={post.type || 0}
            user={post.u || "unknown"}
            active={isOnline.includes(
              post.p.includes(":") && post.u === "Discord"
                ? post.p.split(":")[0]
                : post.u
            )}
            edited={post.edited_at !== undefined}
            author={post.author}
            reactions={post.reactions}
            reply_to={post.reply_to}
          />
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
};

// Memoize the DisplayPosts component to prevent unnecessary re-renders
export default memo(DisplayPosts);
