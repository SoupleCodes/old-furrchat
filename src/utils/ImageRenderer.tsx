import React from "react";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

interface ImageRendererProps {
  src: string; // Source URL of the file to be rendered
  alt: string; // Alternative text for images
}

export const ImageRenderer: React.FC<ImageRendererProps> = ({ src, alt }) => {
  const fileExtension = src.split(".").pop()?.toLowerCase();

  if (src.includes("emoji")) {
    return (
      <img
        src={src}
        alt={alt}
        style={{ maxWidth: "20px" }}
        title={alt}
      />
    );
  } else if (src.endsWith("?preview")) {
    return (
      <img
        src={src}
        alt={alt}
        style={{ height: "auto", width: "auto", maxHeight: "375px" }}
        title={src}
      />
    );
  } else switch (fileExtension) {
    // Audio formats
    case "wav":
    case "mp3":
    case "aac":
    case "flac":
      return (
        <audio
          src={src}
          controls
          style={{ maxHeight: "375px", objectPosition: "50% 50%" }}
          title={src}
        />
      );

    // Video formats
    case "mp4":
    case "webm":
    case "ogg":
    case "mov":
    case "avi":
    case "mkv":
    case "wmv":
      return (
        <video
          src={src}
          controls
          style={{ maxHeight: "375px", objectPosition: "50% 50%" }}
          title={src}
        />
      );

    // Document formats
    case "pdf":
    case "doc":
    case "docx":
    case "xls":
    case "xlsx":
    case "ppt":
    case "pptx":
      // An embed or iframe for documents (PDF supported directly, others can be previewed via Google Docs Viewer)
      return fileExtension === "pdf" ? (
        <embed src={src} type="application/pdf" width="100%" height="800px" />
      ) : (
        <iframe
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(
            src
          )}&embedded=true`}
          width="100%"
          height="800px"
          style={{ border: "none" }}
          title="Document Viewer"
        />
      );

    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "bmp":
    case "tiff":
    case "webp":
    case "svg":
    case "blob?preview":
      return (
        <>
          <Popup trigger={<img
            src={src}
            alt={alt}
            style={{ height: "auto", width: "auto", maxHeight: "375px", cursor: "pointer" }}
            title={src}
          />} position="center center" modal>
            <center>
            <img
              src={src}
              alt={alt}
              style={{ maxWidth: "800px", maxHeight: "600px" }}
              title={src}
            />
            </center>
          </Popup>
        </>
      );

    // Default fallback for unknown file types
    default:
      return (
        <div
          className="attachment-container"
          style={{ textAlign: "center", width: "fit-content" }}
        >
          <p>Cannot display the file(s) directly.</p>
          <a href={src} download>
            Download {src.split("/").pop()}
          </a>
        </div>
      );
  }
}