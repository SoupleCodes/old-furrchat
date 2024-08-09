import "../styles/MarkdownEditor.css";
import "../styles/Markdown.css";
import "../styles/Post.css";
import "../App.css";
import DisplayPosts from "../components/DisplayPosts.tsx";
import PostEditor from "../components/MarkdownEditor.tsx";
import { TypingIndicator } from "../components/TypingIndicators.tsx";
import { usePostContext } from "../Context.tsx"
import { useParams } from 'react-router-dom';

export default function GroupchatPage() {
  const { loginSuccess, userToken } = usePostContext();

  return (
    <>
      <PostEditor userToken={ userToken || ""} context="groupchats" chatId={useParams().chatId}/>{" "}
      <TypingIndicator context="groupchats" chatId={useParams().chatId}/>
      {!loginSuccess && (
        <p style={{ display: "flex", justifyContent: "left", paddingLeft: 20 }}>
          You're not logged in yet!
        </p>
      )}{" "}
      <div className="posts">
        <DisplayPosts context="groupchats" chatId={useParams().chatId}/>
      </div>
    </>
  );
}