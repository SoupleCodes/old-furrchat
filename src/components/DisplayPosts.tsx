import { useState, useEffect, memo } from "react";
import PostComponent from "./PostComponent";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "../styles/PostTransitions.css";

const ws = new WebSocket("wss://server.meower.org");

const DisplayPosts = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState<string[]>([]);

  useEffect(() => {
    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      console.log(data)
      const { cmd, val } = data;

      if (val?._id) {
        setPosts(prevPosts => [val, ...prevPosts]);
      } else if (cmd === "ulist") {
        setIsOnline(val.split(";").slice(0, -1));
      } else if (cmd === "direct") {
        handleDirectCommand(val);
      }
    };

    return () => { ws.onmessage = null; };
  }, [posts, isOnline]);


  const handleDirectCommand = (val: { id?: any; mode?: any; payload?: any; }) => {
    const { mode, payload } = val;
    const updatePost = (post: { _id: any; }) => {
      const updatedPosts = posts.map(p => p._id === post._id ? post : p);
      setPosts(updatedPosts);
    };

    switch (mode) {
      case "update_post":
        updatePost(payload);
        break;
      case "delete":
        setPosts(posts.filter(post => post._id !== val.id));
        break;
      case "post_reaction_add":
      case "post_reaction_remove":
        const updateReaction = (operation: string) => {
          const postIndex = posts.findIndex(p => p.post_id === payload.post_id);
          if (postIndex === -1) return;

          const updatedPosts = [...posts];
          const post = { ...updatedPosts[postIndex] };
          let reactionUpdated = false;

          post.reactions = post.reactions.map((reaction: { emoji: any; count: number; }) => {
            if (reaction.emoji === payload.emoji) {
              reactionUpdated = true;
              reaction.count = operation === "add" ? reaction.count + 1 : reaction.count - 1;
              return reaction.count <= 0 ? null : reaction;
            }
            return reaction;
          }).filter(Boolean);

          if (!reactionUpdated && operation === "add") {
            post.reactions.push({ emoji: payload.emoji, count: 1, user_reacted: false });
          }

          updatedPosts[postIndex] = post;
          setPosts(updatedPosts);
        };

        updateReaction(mode === "post_reaction_add" ? "add" : "remove");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
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
  }, []);

  return (
    <TransitionGroup>
      {posts.map(post => (
        <CSSTransition
          key={post._id || Math.random()}
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
            time={{ e: post.edited_at !== undefined ? post.edited_at : post.t?.e || 0 }}
            type={post.type || 0}
            user={post.u || "unknown"}
            active={isOnline.includes(post.u)}
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

export default memo(DisplayPosts);