import React from "react";
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
} from "../lib/RevisePost.tsx";

// import fetchUserData from '../lib/api/UserData.ts';
import { formatTimestamp } from "../utils/FormatTimestamp.ts";
import { ImageRenderer } from "../utils/ImageRenderer.tsx";

// Define the props type for the PostComponent
interface PostComponentProps {
  attachments: any[]; // List of attachments
  author: any; // Author of the post
  isDeleted: boolean; // Flag indicating if the post is deleted
  post: string; // Content of the post
  pinned: boolean; // Flag indicating if the post is pinned
  post_id: string | null; // Unique ID for the post
  post_origin: string | null; // Origin of the post
  reactions: any[]; // List of reactions to the post
  reply_to: any[]; // List of replies to the post
  time: any; // Timestamp of the post
  type: number; // Type of the post
  _id: string | null; // Unique ID of the post (same as post_id)
  user: string; // Username of the post author
  active: boolean; // Flag indicating if the user is online
  edited: boolean; // Flag indicating if the post has been edited
}

{
  /* Typical post layout
{"cmd": "direct", "val": 
{"mode": 1, "_id": "43dc3779-3e09-4053-ac30-eee4cf79806b", 
"post_origin": "home", 
"u": "Souple", 
"t": {"mo": "07", "d": "19", "y": "2024", "h": "11", "mi": "42", "s": "24", "e": 1721389344}, 
"p": "PknmQ + Bloctans + han +  Souple +  JoshAtticus + tnix100 = Pknlocthansouplatticusnix100", 
"attachments": [], 
"isDeleted": false, 
"pinned": false, 
"reactions": [], 
"type": 1, 
"post_id": "43dc3779-3e09-4053-ac30-eee4cf79806b", 
"author": {"_id": "Souple", "uuid": "2f9d8396-67ab-492b-b3c6-8aa7e7572e5a", "pfp_data": 20, "flags": 0, "avatar": "P5t8aQuP9SPaBJZ6tG6H4DbE", "avatar_color": "965c3f"}, 
"reply_to": []}}
*/
}

// The functional component for rendering a post
export function PostComponent({
  attachments,
  author,
  //  isDeleted,
  post,
  //  pinned,
  //  post_id,
  //  post_origin,
  reactions,
  reply_to,
  time,
  //  type,
  //  _id,
  user,
  active,
  edited,
}: PostComponentProps) {
  
  // Format the timestamp into a readable date string
  const realDate = formatTimestamp(time.e);

  // Fetch and set profile picture and avatar color
  let pfp = author.avatar;
  let avatarColor = `#${author.avatar_color}`;

  // Use default profile picture if no avatar is available
  if (pfp === "") {
    let pfp_data = author.pfp_data;
    pfp =
      pfp_data === -3
        ? "/furrchat/assets/default_pfps/icon_guest-e8db7c16.svg"
        : defaultPFPS[34 - pfp_data];
  } else {
    pfp = `https://uploads.meower.org/icons/${pfp}`;
  }

  // Process and revise the post content
  let realPost = revisePost(post);

  // Handle and format attachments, then append to the post content
  let attachment = handleAttachments(attachments);
  realPost = `${realPost}\n\n${attachment}`;

  return (
    <div className="container">
      <div className="user">
        <span className="post-pfp-container">
          {/* User's profile picture with styling */}
          <img
            src={pfp}
            alt="pfp"
            className="post-pfp"
            width="48"
            height="48"
            style={{
              padding: 5,
              boxShadow: `inset 0 0 3px ${avatarColor}`,
              border: `1.5px solid ${avatarColor}`,
              borderRadius: "10%",
            }}
          />
          {/* Indicator showing if the user is online or offline */}
          {active ? (
            <span className="online-indicator" title="Online"></span>
          ) : (
            <span className="offline-indicator" title="Offline"></span>
          )}
        </span>
        {/* Display username with optional emoji prefix */}
        <p className="post-username-text">
          <strong>
            {userEmojis[user] || ""} {user}
          </strong>
        </p>
      </div>
      <div className="post-content">
        {/* Display timestamp with edit status */}
        <div className="timestamp">
          <i>
            {realDate} {edited ? "(edited)" : ""}
          </i>
        </div>
        <div className="postmessage">
          {getReplies(reply_to)}

          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Custom rendering for code blocks with syntax highlighting
              code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                const inline = !match;
                return !inline && match ? (
                  <SyntaxHighlighter
                    children={String(children).replace(/\n$/, "")}
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
        <br />
        <div className="social">{getReactions(reactions)}</div>
      </div>
    </div>
  );
}

// Export the component wrapped with React.memo for performance optimization
export default React.memo(PostComponent);
