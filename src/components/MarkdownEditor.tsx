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

interface postEditorProps {
  userToken: string;
  context: "home" | "groupchats";
  chatId?: string;
}

const PostEditor = ({ userToken, context, chatId }: postEditorProps) => {
  const { post, setPost } = usePostContext();
  const { replyIds, setReplyIds } = usePostContext();
  const [attachments, setAttachments] = useState<File[]>([]);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const [selectionStart, setSelectionStart] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  let typingTimeout: NodeJS.Timeout | null = null;

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
  
    const requestBody: any = { 
      content: post, 
      attachments: attachmentIds, 
      reply_to: reply_to 
    };
  
    if (context === "groupchats" && chatId) {
      requestBody.chatId = chatId;
    }
  
    fetch(context === "home" ? "https://api.meower.org/home" : `https://api.meower.org/posts/${chatId}`, {
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
    fetch(context === "home" ? "https://api.meower.org/home/typing" : `https://api.meower.org/chats/${chatId}/typing`, {
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

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  return (
    <div>
      <div className="attachments" style={{ borderRadius: '2px' }}>
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
      <div className="markdown-buttons">
        <img src="/furrchat/assets/markdown/B.png" id="bold" className="markdown-item" onClick={() => handleMarkdownClick("**")}/>
        <img src="/furrchat/assets/markdown/I.png" id="italic" className="markdown-item" onClick={() => handleMarkdownClick("*")}/>
        <img src="/furrchat/assets/markdown/S.png" id="strikethrough" className="markdown-item" onClick={() => handleMarkdownClick("~~")}/>
        <Dropdown
          options={headingOptions}
          onSelect={(option: any) =>
            handleMarkdownClick(option.value + " ", false)
          }
        />
        <EmojiPicker
          onEmojiSelect={appendToPost}
          src="/furrchat/assets/markdown/E.png"
          chatID={chatId}
          className="markdown-item"
        />        
        <img src="/furrchat/assets/markdown/Q.png" id="unorderedlist" className="markdown-item" onClick={() => handleMarkdownClick("\n - ", false) }/>
        <img src="/furrchat/assets/markdown/F.png" id="orderedlist" className="markdown-item" onClick={() => handleMarkdownClick("\n1. - ", false) }/>
        <img src="/furrchat/assets/markdown/K.png" id="checkbox" className="markdown-item" onClick={() => handleMarkdownClick("- [] ", false) }/>
        <img src="/furrchat/assets/markdown/D.png" id="quote" className="markdown-item" onClick={() => handleMarkdownClick("> ", false) }/>
        <img src="/furrchat/assets/markdown/P.png" id="code" className="markdown-item" onClick={() => handleMarkdownClick("\n``` \n") }/>
        <img src="/furrchat/assets/markdown/M.png" id="table" className="markdown-item" onClick={() =>
          handleMarkdownClick(
            "\n| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n| Cell 3   | Cell 4   |",
            false
          )
        }/>
        <img src="/furrchat/assets/markdown/N.png" id="hyperlink" className="markdown-item" onClick={() =>
          handleMarkdownClick("[link description](link)", false)
        }/>
        <img src="/furrchat/assets/markdown/L.png" id="image-markdown" className="markdown-item" onClick={() =>
          handleMarkdownClick("![image description](image link)", false)
        }/>
           <label htmlFor="file-upload">
            <img src="/furrchat/assets/markdown/Z.png" id="upload" className="markdown-item"/>
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={ handleFileUpload }
            style={{ display: "none" }}
          />
        <span className="markdown-item" id="preview-button" onClick={() => setShowPreview(!showPreview)}>
          {showPreview ? "Hide Preview" : "Show Preview"}</span>
        <form className="markdown-item" id="post-button" onClick={sendPost}>Post</form>
      </div>
      <span>
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
              onKeyDownCapture={() => {
                if (typingTimeout) {
                  clearTimeout(typingTimeout)
                }

                typingTimeout = setTimeout(() => {
                  sendTypingNotification()
                  typingTimeout = null
                }, 500)
                }}
              style={{
                flex: 1,
                minHeight: "50px",
                maxHeight: "500px",
                padding: "10px",
              }}
              onSelect={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setSelectionStart(e.target.selectionStart);
                setSelectionEnd(e.target.selectionEnd);
              }}
            ></textarea>

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