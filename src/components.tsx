// Imports necessary stuff
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { defaultPFPS } from './components/data';
import { EmojiImage, DiscEmojiSupport, handleAttachments } from './components/post';
import fetchUserData from './components/api';
import { memo } from "react";


// Type definitions for reply
type Reply = {
  id: string;
  postContent: string;
  replyText: string;
};


// Extracts reply from post
const getReply = (post: string): Reply | null => {
  // Stolen from @mybearworld's meower client lol
  const regex = /^(@[a-z_0-9-]+(?: "[^\n]*" (?:\(([a-f0-9\-]+)\))| \[([a-f0-9\-]+)\])(?:\n| )?)(.*)$/is;
  const match = post.match(regex);

  if (!match) {
    return null;
  }
  const postContent = match[4];
  if (postContent === undefined) {
    throw new Error("Post content is not defined");
  }
  const replyText = match[1];
  if (replyText === undefined) {
    throw new Error("Reply text is not defined");
  }
  const id = match[2] || match[3];
  if (id === undefined) {
    throw new Error("ID is not defined");
  }
  return {
    id,
    postContent,
    replyText,
  };
};


// Revises post such as adding emojis, replies and images

function revisePost(text: any) {
  let revisedString: any
  revisedString = DiscEmojiSupport(text)
    revisedString = EmojiImage(revisedString)
    var wholeReply = getReply(revisedString)?.replyText
    revisedString = revisedString.replace(wholeReply, "");
    
    
    let regex, match
  
    regex = /\[\(sticker\) (.+?): (.+)\]/; 
    match = revisedString.match(regex);
    if (match) {
      const name = match[1];
      const imageLink = match[2]; 
      revisedString = revisedString.replace(regex, `![${name}](${imageLink})`);
    }

    
  return revisedString;
}


// Post props!
export function PostComponent ({...postProps}) {
  const {
    attachments,
    post,
//    post_origin,
    time,
//    type,
    user,
    active,
    edited
  } = postProps;

  
// Converts time to readable format
  const realDate = new Date(time.e * 1000);
  const formattedDate = realDate.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short' // Include time zone abbreviation
  });
  

// Checks if post is a reply or not
  var shouldRender;
  var postReply = getReply(post)
  if (postReply === null) {
    shouldRender = false;
  } else {
    shouldRender = true;
}


// Extracts reply from post
let wholeReply:any
wholeReply = postReply?.replyText;
var realPost = revisePost(post)
var realUser = user


// Checks if the user is a discord user or not, if true, the actual user is extracted from the first part of the string
if (realUser === "Discord") {
  realUser = post.split(':')[0]
  realPost = realPost.split(': ')[1]
}


// Extracts the pfp of the user
var pfp = (fetchUserData(realUser, 'avatar'))?.toString();

if (pfp === "") {
  var pfp_data:any = fetchUserData(realUser, 'pfp_data')
    if (pfp_data === -3) {
      pfp = '/furrchat/assets/default_pfps/icon_guest-e8db7c16.svg'
    } else {
      pfp = defaultPFPS[34 - (pfp_data)]
    }
} else {
  pfp = `https://uploads.meower.org/icons/${pfp}`
}

// Extracts the pfp of the person who was replied to
if (!(wholeReply === undefined)) {
let replyUser: any
replyUser = wholeReply.split(' ')[0]
replyUser = replyUser.replace("@", "");
var replyPFP = (fetchUserData(replyUser, 'avatar'))?.toString();
  
  if (replyPFP === "") {
    var pfp_data:any = fetchUserData(replyUser, 'pfp_data')
      if (pfp_data === -3) {
        replyPFP = '/furrchat/assets/default_pfps/icon_guest-e8db7c16.svg'
      } else {
        replyPFP = defaultPFPS[34 - (pfp_data)]
      }
  } else {
    replyPFP = `https://uploads.meower.org/icons/${replyPFP}`
  }
}

// Renders the post images
const ImageRenderer = ({ src, alt }: any) => {
  const fileExtension = src.split('.').pop()?.toLowerCase(); // Get file extension
  switch (fileExtension) {
    case 'wav':
    case 'mp3':
      return <audio src={src} controls />;
    case 'mp4':
    case 'webm':
    case 'ogg':
      return <video src={src} controls style={{ maxWidth: '425px', objectPosition: '50% 50%'}} />;
    case 'pdf':
      return <embed src={src} type="application/pdf" width="100%" height="600px" />;
    default:
      return <img src={src} alt={alt} style={{ height: 'auto', width: 'auto', maxWidth: '425px' }} />;
  }
};

var attachment = (handleAttachments as any)(attachments as any) as any;
realPost = ((realPost as any) +
  ("\n" as any) +
  ("\n" as any) +
  (attachment as any)) as any;
let emojiThing
if (realUser === 'Souple' || realUser === 'ij') {
  emojiThing = "👑"
} else if (realUser === 'noodles') {
  emojiThing = "🧀"
} else if (realUser === 'kiwi') {
  emojiThing = "🥝"
} else if (realUser === 'cat') {
  emojiThing = "🐱"
} else {
  emojiThing = ""
}


// Extracts the whole reply
wholeReply = wholeReply?.substring(0, wholeReply?.lastIndexOf(" "));

// Renders the post
return (
    <div className="container">
      <div className="user">
        <span className="post-pfp-container">
        <img src={pfp} alt="pfp" className="post-pfp" width="48" height="48" style={{ padding: 5 }} />
        { active ? (
        <span className="online-indicator" title="Online"></span> 
        ) : (
        <span className="offline-indicator" title="Offline"></span> 
        )}
        </span>
        <p className="post-username-text"><strong>{emojiThing} {realUser}</strong></p>
      </div>
      <div className="post-content">
        <div className="timestamp"><i>{formattedDate} {edited ? "(edited)" : ""}</i></div>
        <div className="postmessage">
        {shouldRender ? (
          <div className="effect"><i>
          <img src={replyPFP} alt="default pfp" width="16" height="16" style={{ paddingRight: 5 }}/>
          {wholeReply} {attachment}</i></div>
        ) : null}   <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const inline = !match;
            return !inline && match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, '')} // @ts-expect-error
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
          img: ImageRenderer, // Tell ReactMarkdown to use ImageRenderer for img tags
        }}
      >
        {revisePost(realPost)}
      </ReactMarkdown>
        </div>
        <div className="social"></div>
          </div>
      </div>
  );
}


// Fetches from the websocket and passes the approriate data as props
const ws = new WebSocket('wss://server.meower.org');

const MyComponent = () => {
  // State for posts
  var [posts, setPosts] = useState<any[]>([]);
  var [isOnline, setIsOnline] = useState<any[]>([]);

  // Connects to the server
  useEffect(() => {
    ws.onmessage = (message) => {
      console.log('Received message:', message.data);
      const data = JSON.parse(message.data);
      
      if ((!(data.val._id)) === false) {
        setPosts((prevPosts) => [data.val, ...prevPosts]);

      } else if (data.cmd === "ulist") {
        const users = data.val.split(';');
        setIsOnline(users);

      } else if (data.cmd === "direct" && data.val.mode === "update_post") {
        const editedPost = data.val.payload;
        const postIndex = posts.findIndex((post) => post._id === editedPost._id);
        if (postIndex !== -1) {
          const updatedPosts = [...posts];
          updatedPosts[postIndex] = editedPost;
      
          setPosts(updatedPosts);
        }
      
      } else if (data.val.mode === "delete") {
        const postIndex = posts.findIndex((post) => post._id === data.val.id);
        console.log(postIndex);

        if (postIndex !== -1) {
          const updatedPosts = [...posts];
          updatedPosts.splice(postIndex, 1);
          console.log(updatedPosts);
          setPosts(updatedPosts);
        }
      }
    }
    // Clean up the event listener on component unmount
    return () => {
      ws.onmessage = null; 
    };
  }, []);

  // Fetches posts from the home api
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://api.meower.org/home');
        if (response.ok) {
          const data = await response.json();
          console.log('Received message:', data);
          setPosts(data.autoget || []);
        } else {
          console.error('Error fetching posts:', response.statusText);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    fetchPosts();
  }, []);


  return (
    <div>
            {posts.map((post) => (        
     <PostComponent
          id={post._id || Math.random().toString(36).substring(2, 15)}
          attachments={post.attachments || []} // Assuming no attachments for now
          isDeleted={post.isDeleted || false} // Set to false explicitly
          post={post.p || ''} // Set empty string for missing post
          pinned={post.pinned || false} // Set to false explicitly
          post_id={post.post_id || null} // Set default post_id
          post_origin={post.post_origin || null} // Set default post_origin
          time={post.t
            ? {
              e: post.edited_at !== undefined ? post.edited_at : post.t.e,
            }
            : {
              e: 0,
            }}
          type={post.type || 0} // Set default type
          user={post.u || 'unknown'} // Set default user
          active={isOnline.includes(post.p.includes(':') && post.u === 'Discord' ? post.p.split(':')[0] : post.u)}
          edited={post.edited_at !== undefined ? true : false}
          />
      ))}

    </div>
  )
}


export default memo(MyComponent);