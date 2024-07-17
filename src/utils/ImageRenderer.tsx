import React from 'react';

// Define the props type for the ImageRenderer component
interface ImageRendererProps {
  src: string; // Source URL of the file to be rendered
  alt: string; // Alternative text for images
}

export const ImageRenderer: React.FC<ImageRendererProps> = ({ src, alt }) => {
  // Extract the file extension from the source URL and convert it to lowercase
  const fileExtension = src.split('.').pop()?.toLowerCase(); 

  // Render different components based on the file extension
  switch (fileExtension) {
    // Audio formats
    case 'wav':
    case 'mp3':
    case 'aac':
    case 'flac':
    case 'ogg':
      return <audio src={src} controls />;
    
    // Video formats
    case 'mp4':
    case 'webm':
    case 'ogg':
    case 'mov':
    case 'avi':
    case 'mkv':
    case 'wmv':
      return <video 
        src={src} 
        controls 
        style={{ maxWidth: '950px', objectPosition: '50% 50%' }} 
      />;
    
    // Document formats
    case 'pdf':
    case 'doc':
    case 'docx':
    case 'xls':
    case 'xlsx':
    case 'ppt':
    case 'pptx':
      // An embed or iframe for documents (PDF supported directly, others can be previewed via Google Docs Viewer)
      return fileExtension === 'pdf' ? (
        <embed 
          src={src} 
          type="application/pdf" 
          width="100%" 
          height="800px" 
        />
      ) : (
        <iframe 
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(src)}&embedded=true`} 
          width="100%" 
          height="800px" 
          style={{ border: 'none' }}
          title="Document Viewer"
        />
      );
    
    // Image formats
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'tiff':
    case 'webp':
    case 'svg':
      return <img 
        src={src} 
        alt={alt} 
        style={{ height: 'auto', width: 'auto', maxWidth: '950px' }} 
      />;
    
    // Default fallback for unknown file types
    default:
      // Renders as an image for all other file types (assuming they are images)
      return <img 
        src={src} 
        alt={alt} 
        style={{ height: 'auto', width: 'auto', maxWidth: '950px' }} 
      />;
  }
};