import React, { useState, useMemo, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import emojiRegex from "emoji-regex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { defaultPFPS, userEmojis } from "../lib/Data.ts";
import {
  handleAttachments,
  getReplies,
  getReactions,
  revisePost,
  DiscEmojiSupport,
} from "../lib/RevisePost.tsx";
import "/src/styles/SocialButtons.css";
import { deletePost } from "../lib/api/Post/DeletePost.ts";
import { editPost } from "../lib/api/Post/EditPost.ts";
import { usePostContext } from "../Context.tsx";
import { formatTimestamp } from "../utils/FormatTimestamp.ts";
import { ImageRenderer } from "../utils/ImageRenderer.tsx";

// Defines the props type for the PostComponent
interface PostComponentProps {
  attachments: any[];
  author: any;
  isDeleted: boolean;
  post: string;
  pinned: boolean;
  post_id: string | null;
  post_origin: string | null;
  reactions: any[];
  reply_to: any[];
  time: any;
  type: number;
  _id: string | null;
  user: string;
  active: boolean;
  edited: boolean;
}

// The functional component for rendering a post
export const PostComponent: React.FC<PostComponentProps> = ({
  attachments,
  author,
  post,
  post_id,
  reactions,
  reply_to,
  time,
  user,
  active,
  edited,
}) => {
  const { setPost } = usePostContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState<string>(revisePost(post));

  const insertQuotedText = useCallback(() => {
    setPost((prevPost) => `@${user} ${prevPost}`);
  }, [setPost, user, post]);

  const userToken = localStorage.getItem("userToken");

  // Memoize profile picture and avatar color
  const { pfp, avatarColor } = useMemo(() => {
    const pfp = author.avatar
      ? `https://uploads.meower.org/icons/${author.avatar}`
      : defaultPFPS[34 - (author.pfp_data || 0)];
    const avatarColor = `#${author.avatar_color}`;
    return { pfp, avatarColor };
  }, [author]);

  const realDate = useMemo(() => formatTimestamp(time.e), [time.e]);

  // Handle and format attachments, then append to the post content
  const attachment = useMemo(
    () => handleAttachments(attachments),
    [attachments]
  );
  const realPost = useMemo(() => {
    let postContent = revisePost(post);
    return `${postContent}\n\n${attachment}`;
  }, [post, attachment]);

  const isValidEmojiOnly = useMemo(() => {
    const regex = emojiRegex();
    const emojis = DiscEmojiSupport(realPost, false)
      .split("")
      .filter((char) => regex.test(char));
    return emojis.join("") === realPost;
  }, [realPost]);

  const handleEditChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setEditContent(e.target.value);
    },
    []
  );

  const handleSaveEdit = useCallback(async () => {
    if (!post_id || !userToken)
      return console.error("Post ID or user token is missing.");
    try {
      await editPost(post_id, userToken, editContent);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving edited post:", error);
    }
  }, [post_id, userToken, editContent]);

  const { replyIds, setReplyIds } = usePostContext();

  const handleReplyClick = () => {
    const reply = JSON.stringify({
      author: author._id,
      post: post,
      post_id: post_id,
      avatar: author.avatar,
      pfp_data: author.pfp_data,
    });

    if (reply && !replyIds.includes(reply)) {
      setReplyIds((prevIds) => [...prevIds, reply]);
    }
  };

  return (
    <div className="container">
      <div className="user">
        <span className="post-pfp-container">
          <img
            src={pfp}
            alt="pfp"
            className="post-pfp"
            width="48"
            height="48"
            style={{
              borderRadius: "5px",
              border: `1px solid ${avatarColor}`,
              boxShadow:
                "0 2px 1px rgba(0, 0, 0, 0.2), 0 2px 0 0 rgba(255, 255, 255, 0.7)",
            }}
          />
          {active ? (
            <span className="online-indicator" title="Online"></span>
          ) : (
            <span className="offline-indicator" title="Offline"></span>
          )}
        </span>
        <p className="post-username-text">
          <strong>
            {userEmojis[user] || ""} {user}
          </strong>
        </p>
      </div>
      <div className="post-content">
        <div className="timestamp">
          <i>
            {realDate} {edited ? "(edited)" : ""}
          </i>
        </div>
        {isEditing ? (
          <>
            <div
              className="postmessage"
              style={{ fontSize: isValidEmojiOnly ? "20px" : "10px" }}
            >
              {" "}
              <span style={{ fontSize: "10px" }}>{getReplies(reply_to)}</span>
            </div>{" "}
            <hr />
            <div style={{ display: "flex" }}>
              <textarea
                value={editContent}
                onChange={handleEditChange}
                className="edit-box"
              />
              <button className="edit-button" onClick={handleSaveEdit}>
                Save
              </button>
            </div>
          </>
        ) : (
          <div
            className="postmessage"
            style={{ fontSize: isValidEmojiOnly ? "20px" : "10px" }}
          >
            <span style={{ fontSize: "10px" }}>{getReplies(reply_to)}</span>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Custom rendering for code blocks with syntax highlighting
                code({ node, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const inline = !match;
                  return !inline && match ? (
                    <SyntaxHighlighter
                      children={String(children).replace(/\n\n$/, "")}
                      // @ts-ignore
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
                // Custom rendering for images using ImageRenderer
                // @ts-ignore
                img: ImageRenderer,
              }}
            >
              {revisePost(realPost)}
            </ReactMarkdown>
          </div>
        )}
        <hr />
        <div className="social" style={{ display: "flex" }}>
          <div className="reactions">{getReactions(reactions)}</div>
          <div style={{ marginLeft: "auto" }}>
            {/* <EmojiPicker onEmojiSelect={appendToPost} src="/furrchat/assets/markdown/Emoji.png"/>
             <button className="social-buttons" id="ReactButton">
              <img src={`/furrchat/assets/icons/React.png`} height={9} /> React
            </button> */}
            <button
              className="social-buttons"
              id="ReplyButton"
              onClick={() => handleReplyClick()}
              data-reply-id={post_id}
            >
              <img
                src={`/furrchat/assets/icons/Reply.png`}
                height={9}
              />{" "}
              Reply
            </button>
            {userToken ? (
              <>
                <button
                  className="social-buttons"
                  id="DeleteButton"
                  onClick={() => deletePost(post_id, userToken)}
                >
                  <img src={`/furrchat/assets/icons/Delete.png`} height={9} />{" "}
                  Delete
                </button>
                <button
                  className="social-buttons"
                  id="EditButton"
                  onClick={() => setIsEditing(true)}
                >
                  <img src={`/furrchat/assets/icons/Edit.png`} height={9} />{" "}
                  Edit
                </button>
              </>
            ) : (
              ""
            )}
            <button
              className="social-buttons"
              id="QuoteButton"
              onClick={insertQuotedText}
            >
              <img src={`/furrchat/assets/icons/Quote.png`} height={9} /> Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the component wrapped with React.memo for performance optimization
export default React.memo(PostComponent);
