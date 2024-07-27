// React!
import { memo, useEffect, useState } from "react";

// Imports markdown thingies
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

// Imports necessary CSS files
import "/src/styles/MarkdownEditor.css";
import "/src/styles/Markdown.css";
import "/src/styles/Post.css";

// Imports components
import EmojiPicker from "./EmojiPicker.tsx";
import ImageRenderer from "./DisplayPosts.tsx";
import Dropdown from "./Dropdown.tsx";
import { headingOptions, defaultPFPS } from "../lib/Data.ts";
import { uploadFileAndGetId } from "../lib/api/Post/SendPost.ts";
import { usePostContext } from "../Context.tsx";

const PostEditor = ({ userToken }: { userToken: string }) => {
  const { post, setPost } = usePostContext();
  const { replyIds, setReplyIds } = usePostContext();
  const [attachments, setAttachments] = useState<File[]>([]);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const [selectionStart, setSelectionStart] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  
  interface Reply { author: string; post: string; post_id: string; avatar: string; pfp_data: number;}

  const sendPost = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const attachmentIds = await Promise.all(
      attachments.map((file) => uploadFileAndGetId({ file, userToken }))
    );

    const reply_to = Array.isArray(replyIds)
      ? replyIds
          .map((reply) => JSON.parse(reply) as Reply)
          .map((reply) => reply.post_id)
          .filter((id) => id)
      : [];

    const requestBody = { content: post, attachments: attachmentIds, reply_to: reply_to }

    fetch("https://api.meower.org/home", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Token: userToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setPost(""); // Clear post content
        setAttachments([]); // Clear attachments
        setReplyIds([]); // Clear reply IDs
      })
      .catch((error) => {
        console.error("Error sending post:", error);
      });
  };

  const appendToPost = (string: string) => {
    let newCursorPosition = selectionStart + string.length;
    const selectedText = post.substring(selectionStart, selectionEnd);
    const newPost =
      post.substring(0, selectionStart) +
      string +
      selectedText +
      post.substring(selectionEnd);
    newCursorPosition += selectedText.length + string.length;
    setPost(newPost);
  };

  const handleMarkdownClick = (markdown: string, wrap = true) => {
    const selectedText = post.substring(selectionStart, selectionEnd);
    let newPost = post;
    let newCursorPosition = selectionStart + markdown.length;

    if (wrap) {
      newPost =
        post.substring(0, selectionStart) +
        markdown +
        selectedText +
        markdown +
        post.substring(selectionEnd);
      newCursorPosition += selectedText.length + markdown.length;
    } else {
      newPost =
        post.substring(0, selectionStart) +
        markdown +
        selectedText +
        post.substring(selectionEnd);
      newCursorPosition += markdown.length;
    }

    setPost(newPost);
    setSelectionStart(newCursorPosition);
    setSelectionEnd(newCursorPosition);
  };

  const sendTypingNotification = () => {
    fetch("https://api.meower.org/home/typing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Token: userToken,
      },
    })
  }

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement> | { target: { files: FileList } }
  ) => {
    const files = event.target.files;
    if (files) {
      const newAttachments = Array.from(files);
      setAttachments((prevAttachments) => [
        ...prevAttachments,
        ...newAttachments,
      ]);
    }
  };

  function createFileList(files: File[]): FileList {
    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    return dataTransfer.files;
  }

  // Handle paste event for images
  const handlePaste = async (event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (items) {
      for (const item of items) {
        if (item.kind === "file" && item.type.startsWith("image/")) {
          const blob = item.getAsFile();
          console.log(blob);
          if (blob) {
            const file = new File(
              [blob],
              `i-really-love-soup.${blob.type.split("/")[1]}`,
              { type: blob.type }
            );
            handleFileUpload({ target: { files: createFileList([file]) } });
          }
        }
      }
    }
  };

  // Attach and clean up paste event listener
  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  return (
    <div>
      <div className="markdown-container">
        <EmojiPicker
          onEmojiSelect={appendToPost}
          src="/furrchat/assets/markdown/Emoji.png"
        />
        <Dropdown
          options={headingOptions}
          onSelect={(option: any) =>
            handleMarkdownClick(option.value + " ", false)
          }
        />

        {[
          { icon: "Bold.png", action: () => handleMarkdownClick("**") },
          {
            icon: "Strikethrough.png",
            action: () => handleMarkdownClick("~~"),
          },
          { icon: "Italic.png", action: () => handleMarkdownClick("*") },

          {
            icon: "UnorderedList.png",
            action: () => handleMarkdownClick("\n - ", false),
          },
          {
            icon: "OrderedList.png",
            action: () => handleMarkdownClick("\n1. - ", false),
          },
          {
            icon: "Checklist.png",
            action: () => handleMarkdownClick("- [] ", false),
          },
          { icon: "Quote.png", action: () => handleMarkdownClick("> ", false) },
          { icon: "Code.png", action: () => handleMarkdownClick("\n``` \n") },
          {
            icon: "Table.png",
            action: () =>
              handleMarkdownClick(
                "\n| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n| Cell 3   | Cell 4   |",
                false
              ),
          },
          {
            icon: "Link.png",
            action: () =>
              handleMarkdownClick("[link description](link)", false),
          },
          {
            icon: "Image.png",
            action: () =>
              handleMarkdownClick("![image description](image link)", false),
          },
        ].map(({ icon, action }) => (
          <div className="markdown-button" onClick={action} key={icon}>
            <img
              src={`/furrchat/assets/markdown/${icon}`}
              alt={icon.replace(".png", "")}
              height="48"
              title={icon
                .replace(".png", "")
                .replace(/([A-Z])/g, " $1")
                .trim()}
            />
          </div>
        ))}

        <div className="markdown-button">
          <label htmlFor="file-upload">
            <img
              src="/furrchat/assets/markdown/Upload.png"
              alt="Upload Image"
              height="48"
              title="Upload Image"
            />
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={ handleFileUpload }
            style={{ display: "none" }}
          />
        </div>

        <div
          className="markdown-button"
          onClick={() => setShowPreview(!showPreview)}
        >
          <img
            src="/furrchat/assets/markdown/Preview.png"
            alt="preview"
            height="48"
            title="Preview (Alpha)"
          />
        </div>
      </div>
      <div className="attachments">
        {replyIds.map((reply, index) => (
          <div
            className="attachment-container"
            key={index}
            style={{ display: "flex" }}
          >
            <div className="reply">
              <i>
                {JSON.parse(reply).avatar ? (
                  <img
                    src={
                      JSON.parse(reply).avatar === ""
                        ? JSON.parse(reply).pfp_data === -3
                          ? "/furrchat/assets/default_pfps/icon_guest-e8db7c16.svg"
                          : `${defaultPFPS[34 - JSON.parse(reply).pfp_data]}`
                        : `https://uploads.meower.org/icons/${
                            JSON.parse(reply).avatar
                          }`
                    }
                    alt="reply pfp"
                    width="16"
                    height="16"
                    style={{ paddingRight: 5 }}
                  />
                ) : null}
                <b>{JSON.parse(reply).author}</b>: {JSON.parse(reply).post}
              </i>
            </div>
            <button
              onClick={() => {
                const newReplies = [...replyIds];
                newReplies.splice(index, 1);
                setReplyIds(newReplies);
              }}
              style={{
                width: "20px",
                height: "25px",
                float: "right",
              }}
            >
              {"X"}
            </button>
          </div>
        ))}
      </div>
      <span
        className="userpost"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          resize: "none",
          marginBottom: "14px",
        }}
      >
        {showPreview ? (
          <div className="markdown-preview">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const inline = !match;
                  return !inline && match ? (
                    <SyntaxHighlighter
                      children={String(children).replace(/\n$/, "")} // @ts-expect-error
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
                // @ts-ignore
                img: ImageRenderer,
              }}
            >
              {post}
            </ReactMarkdown>
          </div>
        ) : (
          <form onSubmit={sendPost} style={{ display: "flex" }}>
            <textarea
              name="post"
              value={post}
              onChange={(e) => setPost(e.target.value)}
              placeholder="What's on your mind?"
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === "Enter" && e.shiftKey) {
                  e.preventDefault();
                  setPost(post + "\n");
                } else if (e.key === "Enter") {
                  //@ts-ignore
                  sendPost(e);
                }
              }}
              onKeyDownCapture={() => sendTypingNotification()}
              style={{
                flex: 1,
                marginRight: "5px",
                width: "1090px",
                minHeight: "50px",
                maxHeight: "500px",
                background:
                  "linear-gradient(to bottom, rgba(255, 255, 255, 0.8) 0%, rgba(72, 173, 148, 0.3) 100%)",
                borderColor: "4px solid rgba(0, 0, 0, 0.2)",
                borderRadius: "10px",
                border: "1px solid #83838396",
                boxShadow:
                  "5px 5px 10px rgba(0, 0, 0, 0.5), -5px -5px 10px rgba(255, 255, 255, 0.3), 0 3px 1px rgba(0, 0, 0, 0.2), 0 2px 0 0 rgba(255, 255, 255, 0.7) inset",
                padding: "10px",
              }}
              onSelect={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setSelectionStart(e.target.selectionStart);
                setSelectionEnd(e.target.selectionEnd);
              }}
            ></textarea>
            <button
              type="submit"
              style={{
                width: "70px",
                background:
                  "linear-gradient(to bottom, #ffffff 0%, #e6e6e6 50%, #cccccc 100%)",
                boxShadow:
                  "5px 5px 10px rgba(0, 0, 0, 0.5), -5px -5px 10px rgba(255, 255, 255, 0.3), 0 3px 1px rgba(0, 0, 0, 0.2), 0 2px 0 0 rgba(255, 255, 255, 0.7) inset",
                borderRadius: "5px",
                border: "1px solid #83838396",
                padding: "10px",
                color: "grey",
              }}
            >
              Post
            </button>

            <div></div>
          </form>
        )}
      </span>
      <div>
        <div className="attachments">
          {attachments.map((file, index) => (
            <div className="attachment-container" key={index}>
              {file.type.startsWith("image/") && (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  style={{
                    height: "40px",
                  }}
                />
              )}
              <button
                onClick={() => {
                  const newAttachments = [...attachments];
                  newAttachments.splice(index, 1);
                  setAttachments(newAttachments);
                }}
                style={{
                  width: "20px",
                  height: "25px",
                  float: "right",
                }}
              >
                {"X"}
              </button>
              <br />
              {file.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(PostEditor);