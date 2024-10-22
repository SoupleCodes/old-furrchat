// @ts-nocheck

import React, { useState, useMemo, useCallback, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import emojiRegex from "emoji-regex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { Link, useParams } from 'react-router-dom';

import { defaultPFPS, userEmojis } from "../lib/Data.ts";
import { formatTimestamp } from "../utils/FormatTimestamp.ts";
import { deletePost } from "../lib/api/Post/DeletePost.ts"
import { editPost } from "../lib/api/Post/EditPost.ts"
import { reactToAPost } from "../lib/api/Post/ReactToPost.ts"
import { handleAttachments, getReplies, getReactions, revisePost, DiscEmojiSupport } from "../lib/RevisePost.tsx";
import { ImageRenderer } from "../utils/ImageRenderer.tsx";
import { usePostContext } from "../Context.tsx";

import "/src/styles/SocialButtons.css";
import EmojiPicker from "./EmojiPicker.tsx";
import Popup from "reactjs-popup";
import { handleReportSubmit } from "../lib/api/Post/HandleReportSubmit.ts";

export const scrollToPost = (id: string) => {
  if (id) {
    const element = document.getElementById(id);
    element ? element.scrollIntoView({ behavior: 'smooth' }) : console.log(`Element with ID ${id} not found`);
  } else {
    console.log("Too far away booooo");
  }
};

export interface PostComponentProps {
  u: any
  p: any
  attachments: any[];
  author: {
    _id: string;
    avatar: string;
    pfp_data: number;
    avatar_color: string;
  };
  post: string;
  post_id: string | null;
  pinned: boolean;
  isDeleted: boolean;
  post_origin: string | null;
  reactions: any[];
  reply_to: any[];
  time: { e: number } | null;
  user: string;
  type: number;
  active: boolean;
  edited: boolean;
}

export const PostComponent = React.memo(({ attachments, author, post, post_id, reactions, reply_to, time, user, active, edited }: PostComponentProps) => {
  const { setPost, userToken, userData, replyIds, setReplyIds } = usePostContext();
  const reactToPost = reactToAPost();
  const currentUser = userData?.username;

  const [selectedOption, setSelectedOption] = useState('');

  const [reportError, setReportError] = useState('');
  const [additionalComment, setAdditionalComment] = useState('');

  const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
    if (event.target.value !== 'other') {
      setAdditionalComment('');
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState((post));
  const [pfp, setPfp] = useState('');

  const avatarColor = `#${author.avatar_color}`;
  const realDate = time?.e ? formatTimestamp(time.e) : 'Invalid time';

  const imageCache = useMemo(() => new Map(), []);
  useEffect(() => {
    const imageUrl = `https://uploads.meower.org/icons/${author.avatar}`;
    if (imageCache.has(imageUrl)) {
      setPfp(imageCache.get(imageUrl));
      return;
    }

    const img = new Image();
    img.onload = () => {
      setPfp(imageUrl);
      imageCache.set(imageUrl, imageUrl);
    };
    img.onerror = () => {
      const fallbackPfp = author.pfp_data === -3 || !defaultPFPS[author.pfp_data]
        ? "/furrchat/assets/default_pfps/icon_guest-e8db7c16.svg"
        : `${defaultPFPS[author.pfp_data]}`;
      setPfp(fallbackPfp);
      imageCache.set(imageUrl, fallbackPfp);
    };
    img.src = imageUrl;
  }, [author.avatar, author.pfp_data, imageCache]);

  const attachment = useMemo(() => handleAttachments(attachments), [attachments]);
  const realPost = useMemo(() => `${revisePost(post)}\n\n${attachment}`, [post, attachment]);
  const isValidEmojiOnly = useMemo(() => {
    const emojis = DiscEmojiSupport(realPost, false).split("").filter((char) => emojiRegex().test(char));
    return emojis.join("") === realPost;
  }, [realPost]);

  const handleEditChange = useCallback((e: { target: { value: React.SetStateAction<string>; }; }) => setEditContent(e.target.value), []);

  const handleSaveEdit = useCallback(async () => {
    if (!post_id || !userToken) return console.error("Post ID or user token is missing.");
    try {
      await editPost(post_id, userToken, editContent);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving edited post:", error);
    }
  }, [post_id, userToken, editContent]);

  const handleReplyClick = () => {
    const reply = JSON.stringify({ author: author._id, post, post_id, avatar: author.avatar, pfp_data: author.pfp_data });
    if (reply && !replyIds.includes(reply)) {
      setReplyIds((prevIds) => [...prevIds, reply]);
    }
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const handleReportClick = async (close: () => void) => {
    if (!selectedOption) {
      setReportError("Please select a reason for reporting.");
      return;
    }
    try {
      console.log(userToken, post_id, selectedOption, additionalComment)
      await handleReportSubmit(userToken, post_id, selectedOption, additionalComment);
      close();
    } catch (error) {
      console.error("Error submitting report:", error);
      setReportError("Failed to submit report. Please try again.");
    }
  };

  const Report = ({ close }: { close: () => void }) => {
    return (
      <div className="report-modal">
        <button className="close" onClick={close}>&times;</button>
        <div className="header"> Report Post </div>
        <div className="content">
          {reportError && <div className="error-message">{reportError}</div>}
          <select value={selectedOption} onChange={handleOptionChange}>
            <option value="">Select a reason</option>
            <option value="spam">Spam</option>
            <option value="harassment">Harassment</option>
            <option value="hate_speech">Hate Speech</option>
            <option value="nudity">Nudity or Sexual Content</option>
            <option value="bullying">Bullying or Cyberbullying</option>
            <option value="self_harm">Self-Harm or Suicide Talk</option>
            <option value="child_exploitation">Child Exploitation</option>
            <option value="scams">Scams or Fraud</option>
            <option value="misinformation">Misinformation or Fake News</option>
            <option value="impersonation">Impersonation of Someone Else</option>
            <option value="inappropriate_content">Inappropriate Content</option>
            <option value="malware">Malware or Phishing Attempts</option>
            <option value="trolling">Trolling or Provocative Behavior</option>
            <option value="addiction">Excessive Use or Addiction</option>
            <option value="privacy_violation">Privacy Violation</option>
            <option value="other">Other</option>
          </select>
          {selectedOption === 'other' && (
            <>
              <br />
              <textarea
                style={{ width: '295px', height: '100px' }}
                placeholder="Please specify your reason here..."
                value={additionalComment}
                onChange={(e) => setAdditionalComment(e.target.value)}
              />
            </>
          )}
          <p>Are you sure you want to report this post?</p>
        </div>
        <div className="actions">
          <button
            className="button"
            onClick={() => handleReportClick(close)}
          >
            Report
          </button>
          <button
            className="button"
            onClick={close}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };


  return (
    <div id={post_id || ""} className="container">
      <div className="user">
        <Link to={`/users/${user}`}>
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
                boxShadow: "0 2px 1px rgba(0, 0, 0, 0.2), 0 2px 0 0 rgba(255, 255, 255, 0.7)",
                objectFit: 'cover'
              }}
            />
            <span className={active ? "online-indicator" : "offline-indicator"} title={active ? "Online" : "Offline"}></span>
          </span>
        </Link>
        <p className="post-username-text">
          <strong>{userEmojis[user] || ""} {user}</strong>
        </p>
      </div>
      <div className="post-content">
        <div className="timestamp">
          <i>{realDate} {edited ? "(edited)" : ""}</i>
        </div>
        {isEditing ? (
          <>
            <div className="postmessage" style={{ fontSize: isValidEmojiOnly ? "20px" : "10px" }}>
              <span style={{ fontSize: "10px" }}>{getReplies(reply_to)}</span>
            </div>
            <div style={{ display: "flex", paddingTop: '10px' }}>
              <textarea
                value={editContent}
                onChange={handleEditChange}
                className="edit-box"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.shiftKey ? setPost(post + "\n") : handleSaveEdit();
                  }
                }}
                autoFocus
              />
              <button className="edit-button" style={{ width: '70px' }} onClick={handleSaveEdit}>Save</button>
            </div>
          </>
        ) : (
          <div className="postmessage" style={{ fontSize: isValidEmojiOnly ? "20px" : "10px" }}>
            <span style={{ fontSize: "10px" }}>{getReplies(reply_to)}</span>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const inline = !match;
                  return !inline && match ? (
                    // @ts-ignore
                    <SyntaxHighlighter style={dark} language={match[1]} PreTag="div" {...props}>
                      {String(children).replace(/\n\n\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>{children}</code>
                  );
                },
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
          <div className="reactions">{getReactions(reactions, post_id, reactToPost)}</div>
          <div style={{ marginLeft: "auto" }}>
            <button className="social-buttons" id="ReactButton">
              <EmojiPicker
                className="social-buttons-react-button"
                chatID={useParams().chatId}
                onEmojiSelect={(emoji) => reactToPost(post_id, emoji)}
                src="/furrchat/assets/markdown/E.png"
                text=" React"
              />
            </button>
            <button className="social-buttons" id="ReplyButton" onClick={handleReplyClick} data-reply-id={post_id}>
              <img src={`/furrchat/assets/icons/Reply.png`} height={9} alt="Reply" /> Reply
            </button>
            {user === currentUser && (
              <>
                <button className="social-buttons" id="DeleteButton" onClick={() => deletePost(post_id, userToken)}>
                  <img src={`/furrchat/assets/icons/Delete.png`} height={9} alt="Delete" /> Delete
                </button>
                <button className="social-buttons" id="EditButton" onClick={() => setIsEditing(true)}>
                  <img src={`/furrchat/assets/icons/Edit.png`} height={9} alt="Edit" /> Edit
                </button>
              </>
            )}
            <button className="social-buttons" id="QuoteButton" onClick={() => setPost((prev) => `@${user} ${prev}`)}>
              <b>@</b> Ping
            </button>

            <Popup
              trigger={
                <button className="social-buttons" id="ReportButton">
                  <b>&#33;</b> Report
                </button>
              }
              modal
              nested
              closeOnDocumentClick
              contentStyle={{ padding: '20px', borderRadius: '8px' }}
              overlayStyle={{ background: 'rgba(0, 0, 0, 0.5)' }}
            >
              {close => <Report close={close} />}
            </Popup>

          </div>
        </div>
      </div>
    </div>
  );
});

export default PostComponent;
