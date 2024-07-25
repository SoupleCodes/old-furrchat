// React!
import { memo, useState } from "react";

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
import { headingOptions } from "../lib/Data.ts";
import { uploadFileAndGetId } from "../lib/api/Post/SendPost.ts";

// import { client } from "@meower-media/api-client"

const PostEditor = ({ userToken }: { userToken: string }) => {
  const [post, setPost] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const [selectionStart, setSelectionStart] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const sendPost = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const attachmentIds = await Promise.all(attachments.map((file) => uploadFileAndGetId({ file, userToken })));
  
    const requestBody = {
      content: post,
      attachments: attachmentIds
    };
    
    fetch("https://api.meower.org/home", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Token: userToken,
      },
    })
    .then(response => response.json() )
    .then(data => {
      console.log(data)
      setPost(""); // Clear post content
      setAttachments([]); // Clear attachments
    })
    .catch(error => {
      console.error("Error sending post:", error);
      // ERROR ERROR ERROR ERROR ERROR ERROR 
    });
  }    
  
  const appendToPost = (string: string) => {
    const selectedText = post.substring(selectionStart, selectionEnd);
    const newPost =
      post.substring(0, selectionStart) +
      string +
      selectedText +
      post.substring(selectionEnd);
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files;
  if (files) {
    // Convert FileList to array and update attachments state
    const newAttachments = Array.from(files);
    setAttachments([...attachments, ...newAttachments]);
  }
};


  return (
    <div>
      <div className="markdown-container">
        <EmojiPicker onEmojiSelect={appendToPost} src="/furrchat/assets/markdown/Emoji.png"/>

        <div
          className="markdown-button"
          onClick={() => handleMarkdownClick("**")}
        >
          <img
            src="/furrchat/assets/markdown/Bold.png"
            alt="Bold"
            className="emoji-icon"
            height="48"
            title="Bold"
          />
        </div>

        <div
          className="markdown-button"
          onClick={() => handleMarkdownClick("~~")}
        >
          <img
            src="/furrchat/assets/markdown/Strikethrough.png"
            alt="strikethrough"
            height="48"
            title="Strikethrough"
          />
        </div>

        <div
          className="markdown-button"
          onClick={() => handleMarkdownClick("*")}
        >
          <img
            src="/furrchat/assets/markdown/Italic.png"
            alt="italic"
            height="48"
            title="Italic"
          />
        </div>

        <Dropdown
          options={headingOptions}
          onSelect={(option: any) =>
            handleMarkdownClick(option.value + " ", false)
          }
        />

        <div
          className="markdown-button"
          onClick={() => handleMarkdownClick("\n - ", false)}
        >
          <img
            src="/furrchat/assets/markdown/UnorderedList.png"
            alt="unorderedlist"
            height="48"
            title="Unordered List"
          />
        </div>

        <div
          className="markdown-button"
          onClick={() => handleMarkdownClick("\n1. - ", false)}
        >
          <img
            src="/furrchat/assets/markdown/OrderedList.png"
            alt="orderedlist"
            height="48"
            title="Ordered List"
          />
        </div>

        <div
          className="markdown-button"
          onClick={() => handleMarkdownClick("- [] ", false)}
        >
          <img
            src="/furrchat/assets/markdown/Checklist.png"
            alt="checklist"
            height="48"
            title="Checkbox"
          />
        </div>

        <div
          className="markdown-button"
          onClick={() => handleMarkdownClick("> ", false)}
        >
          <img
            src="/furrchat/assets/markdown/Quote.png"
            alt="quote"
            height="48"
            title="Quote"
          />
        </div>

        <div
          className="markdown-button"
          onClick={() => handleMarkdownClick("\n``` \n")}
        >
          <img
            src="/furrchat/assets/markdown/Code.png"
            alt="code"
            height="48"
            title="Code"
          />
        </div>

        <div
          className="markdown-button"
          onClick={() =>
            handleMarkdownClick(
              "\n| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n| Cell 3   | Cell 4   |",
              false
            )
          }
        >
          <img
            src="/furrchat/assets/markdown/Table.png"
            alt="table"
            height="48"
            title="Table"
          />
        </div>

        <div
          className="markdown-button"
          onClick={() => handleMarkdownClick("[link description](link)", false)}
        >
          <img
            src="/furrchat/assets/markdown/Link.png"
            alt="link"
            height="48"
            title="Link"
          />
        </div>

        <div
          className="markdown-button"
          onClick={() =>
            handleMarkdownClick("![image description](image link)", false)
          }
        >
          <img
            src="/furrchat/assets/markdown/Image.png"
            alt="image"
            height="48"
            title="Image Markdown"
          />
        </div>

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
    onChange={handleFileUpload} 
    style={{ display: 'none' }} 
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

      <span
        className="userpost"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          resize: "none",
          marginBottom: '14px'
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
          
          <form onSubmit={sendPost} style={{ display: "flex", maxHeight: "500px" }}>
            <textarea
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
              required
              style={{
                flex: 1,
                marginRight: "5px",
                width: "1090px",
                paddingBottom: "25px",
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
            />
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
                fontWeight: 800,
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
    {file.type.startsWith('image/') && ( 
      <img 
        src={URL.createObjectURL(file)} 
        alt={file.name} 
        style={{
          height: '40px'
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
      width:'20px',
      height:'25px',
      float: 'right'
      }}
    >{"X"}
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