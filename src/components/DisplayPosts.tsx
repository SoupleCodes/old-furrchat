import { useState, useEffect, memo, useCallback } from "react";
import PostComponent from "./PostComponent";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "../styles/PostTransitions.css";
import { usePostContext } from "../Context";

const ws = new WebSocket(`wss://server.meower.org/?v=1&token=${JSON.parse(localStorage.getItem("userData") || "{}").token}`);

interface DisplayPostsProps {
  context: "home" | "groupchats";
  chatId?: string;
}

const DisplayPosts = ({ context, chatId }: DisplayPostsProps) => {
  const { userToken } = usePostContext();
  const [posts, setPosts] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const bannedUsers = new Set(
    (JSON.parse(localStorage.getItem("userData") || "{}").relationships || [])
      .filter((rel: { state: number }) => rel.state === 2)
      .map((rel: { username: string }) => rel.username)
  );

  useEffect(() => {
    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      handleDirectCommand(data);
    };
    return () => { ws.onmessage = null; };
  }, [posts, isOnline]);

  const fetchPosts = useCallback(async (pageNumber: number) => {
    setLoading(true);
    try {
      const url = context === "groupchats" && chatId
        ? `https://api.meower.org/posts/${chatId}?page=${pageNumber}`
        : `https://api.meower.org/home?page=${pageNumber}`;

      const headers: HeadersInit = userToken ? { "Token": userToken } : {};

      const response = await fetch(url, { headers });
      if (response.ok) {
        const data = await response.json();

        const newPosts = data.autoget || [];
        setPosts(prevPosts => [...prevPosts, ...newPosts]);
        setHasMore(newPosts.length > 0);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setLoading(false);
    }
  }, [context, chatId, userToken]);

  useEffect(() => {
    fetchPosts(page);
  }, [page, fetchPosts]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight && hasMore && !loading) {
        setPage(prevPage => prevPage + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

  const handleDirectCommand = (data: { cmd?: string; val?: any }) => {
    const { cmd: mode, val } = data;
    console.log(data)
    if (!val) return;

    switch (mode) {
      case "post":
        if (val.post_origin === chatId || (context === "home" && val.post_origin === context)) {
        setPosts(prevPosts => [val, ...prevPosts]);
        }
        break;
      case "ulist":
        setIsOnline(val.split(";").slice(0, -1));
        break;
      case "update_post":
          setPosts(posts.map(p => p._id === val._id ? val : p));
        break;
      case "delete_post":
        setPosts(posts.filter(post => post._id !== val.post_id));
        break;
      case "post_reaction_add":
      case "post_reaction_remove":
        setPosts(posts.map(p => {
          if (p.post_id !== val.post_id) return p;
          const updatedReactions = p.reactions.map((reaction: { emoji: any; count: number; }) => {
            if (reaction.emoji === val.emoji) {
              reaction.count = mode === "post_reaction_add" ? reaction.count + 1 : reaction.count - 1;
              return reaction.count <= 0 ? null : reaction;
            }
            return reaction;
          }).filter(Boolean);
          if (mode === "post_reaction_add" && !updatedReactions.some((r: { emoji: any; }) => r.emoji === val.emoji)) {
            updatedReactions.push({ emoji: val.emoji, count: 1 });
          }
          return { ...p, reactions: updatedReactions };
        }));
        break;
      default:
        console.warn(`Unhandled command: ${mode}`);
        break;
    }
  };

  return (
    <>
      <TransitionGroup>
        {posts
          .filter(post => !bannedUsers.has(post.u))
          .map(post => (
            <CSSTransition
              key={post._id || Math.random()}
              timeout={500}
              classNames="post-transition"
            >
              <PostComponent
                attachments={post.attachments || []}
                isDeleted={post.isDeleted || false}
                post={post.p || ""}
                pinned={post.pinned || false}
                post_id={post.post_id || null}
                post_origin={post.post_origin || null}
                time={{ e: post.edited_at || post.t?.e || 0 }}
                type={post.type || 0}
                user={post.u || "unknown"}
                active={isOnline.includes(post.u)}
                edited={Boolean(post.edited_at)}
                author={post.author}
                reactions={post.reactions}
                reply_to={post.reply_to} 
                u={undefined} 
                p={undefined} />
            </CSSTransition>
          ))}
      </TransitionGroup>
      {loading && <p>Loading more posts...</p>}
    </>
  );
};

export default memo(DisplayPosts);