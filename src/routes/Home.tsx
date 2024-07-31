import "../styles/MarkdownEditor.css";
import "../styles/Markdown.css";
import "../styles/Post.css";
import "../App.css";
import MyComponent from "../components/DisplayPosts.tsx";
import PostEditor from "../components/MarkdownEditor.tsx";
import UListBody from "../components/Ulist.tsx";
import { TypingIndicator } from "../components/TypingIndicators.tsx";
import { usePostContext } from "../Context.tsx"

export default function App() {
  const { loginSuccess, userToken } = usePostContext();

  return (
    <>
      <UListBody />
      <PostEditor userToken={ userToken || ""} />{" "}
      <TypingIndicator />
      {!loginSuccess && (
        <p style={{ display: "flex", justifyContent: "left", paddingLeft: 20 }}>
          You're not logged in yet!
        </p>
      )}{" "}
      <div className="posts">
        <MyComponent />
      </div>
    </>
  );
}