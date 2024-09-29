import "../styles/MarkdownEditor.css";
import "../styles/Markdown.css";
import "../styles/Post.css";
import "../App.css";
import DisplayPosts from "../components/DisplayPosts.tsx";
import PostEditor from "../components/MarkdownEditor.tsx";
import { TypingIndicator } from "../components/TypingIndicators.tsx";
import { usePostContext } from "../Context.tsx";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getPostsFromUser } from "../lib/api/Post/GetPostsFromUser.ts";

export default function UserDmPage() {
  const { loginSuccess, userToken } = usePostContext();
  const { username } = useParams();
  const [userId, setUserId] = useState<any>(undefined);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    if (username && userToken) {
      getPostsFromUser({ user: username, userToken, userParam: "dm" })
        .then(userData => {
          setUserId(userData._id);
        })
        .catch(err => {
          console.error("Failed to fetch posts:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [username, userToken]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <PostEditor userToken={userToken || ""} context="groupchats" chatId={userId} />
      <TypingIndicator context="groupchats" chatId={userId} />
      {!loginSuccess && (
        <p style={{ display: "flex", justifyContent: "left", paddingLeft: 20 }}>
          You're not logged in yet!
        </p>
      )}
      <div className="posts">
        <DisplayPosts context="groupchats" chatId={userId} />
      </div>
    </>
  );
}