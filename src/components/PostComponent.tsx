import React, { useState, useMemo, useCallback } from "react";
import ReactMarkdown from "react-markdown";
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

// Define the props type for the PostComponent
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
export function PostComponent({
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
}: PostComponentProps) {
  const { setPost } = usePostContext();
  const [, setReplyIds] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState<string>(revisePost(post));

  const addReply = useCallback((postId: string) => {
    setReplyIds(prevReplyIds => [...prevReplyIds, postId]);
  }, []);

  const insertQuotedText = useCallback(() => {
    setPost(prevPost => `> @${user} ${post} \n ${prevPost}`);
  }, [setPost, user, post]);

  const userToken = localStorage.getItem("userToken");

  // Memoize profile picture and avatar color
  const { pfp, avatarColor } = useMemo(() => {
    let pfp = author.avatar || "";
    let avatarColor = `#${author.avatar_color}`;

    if (!pfp) {
      let pfp_data = author.pfp_data;
      pfp =
        pfp_data === -3
          ? "/furrchat/assets/default_pfps/icon_guest-e8db7c16.svg"
          : defaultPFPS[34 - pfp_data];
    } else {
      pfp = `https://uploads.meower.org/icons/${pfp}`;
    }

    return { pfp, avatarColor };
  }, [author]);

  const realDate = useMemo(() => formatTimestamp(time.e), [time.e]);

  // Handle and format attachments, then append to the post content
  const attachment = useMemo(() => handleAttachments(attachments), [attachments]);
  const realPost = useMemo(() => {
    let postContent = revisePost(post);
    return `${postContent}\n\n${attachment}`;
  }, [post, attachment]);

  const isValidEmojiOnly = useMemo(() => {
    const emojiRegex = /^[\p{Emoji_Presentation}\s]*$/gu;
    return emojiRegex.test(DiscEmojiSupport(realPost, false));
  }, [realPost]);

  const handleEditChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditContent(e.target.value);
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!post_id || !userToken) {
      console.error("Post ID or user token is missing.");
      return;
    }

    try {
      await editPost(post_id, userToken, editContent);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving edited post:", error);
    }
  }, [post_id, userToken, editContent]);

  return (
    <div className="container">
      <div className="user">
        <span className="post-pfp-container" style={{ padding: "4px" }}>
          <img
            src={pfp}
            alt="pfp"
            className="post-pfp"
            width="48"
            height="48"
            style={{
              borderRadius: "5px",
              border: `1px solid ${avatarColor}`,
              boxShadow: "0 2px 1px rgba(0, 0, 0, 0.2), 0 2px 0 0 rgba(255, 255, 255, 0.7)",
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
          <div style={{ display: "flex" }}>
            <textarea
              className="postmessage"
              value={editContent}
              onChange={handleEditChange}
              style={{
                flex: 1,
                paddingBottom: "25px",
                marginRight: "5px",
                height: "50px",
                maxHeight: "500px",
                width: "995px",
                background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.8) 0%, rgba(200, 200, 200, 0.3) 100%)",
                borderColor: "4px solid rgba(0, 0, 0, 0.2)",
                borderRadius: "10px",
                border: "1px solid #83838396",
                boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.5), -5px -5px 10px rgba(255, 255, 255, 0.3), 0 3px 1px rgba(0, 0, 0, 0.2), 0 2px 0 0 rgba(255, 255, 255, 0.7) inset",
              }}
            />
            <button
              style={{
                width: "70px",
                background: "linear-gradient(to bottom, #ffffff 0%, #e6e6e6 50%, #cccccc 100%)",
                boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.5), -5px -5px 10px rgba(255, 255, 255, 0.3), 0 3px 1px rgba(0, 0, 0, 0.2), 0 2px 0 0 rgba(255, 255, 255, 0.7) inset",
                borderRadius: "5px",
                border: "1px solid #83838396",
                padding: "10px",
                fontWeight: 800,
                color: "grey",
              }}
              onClick={handleSaveEdit}
            >
              Save
            </button>
          </div>
        ) : (
          <div className="postmessage" style={{ fontSize: isValidEmojiOnly ? "20px" : "10px" }}>
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
              onClick={() => addReply(post_id || "")}
            >
              <img
                src={`/furrchat/assets/icons/Reply.png`}
                height={9}
                onClick={insertQuotedText}
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
}

// Export the component wrapped with React.memo for performance optimization
export default React.memo(PostComponent);