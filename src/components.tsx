// Imports necessary stuff
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { defaultPFPS } from './components/data'
import { EmojiImage } from './components/post'
import { DiscEmojiSupport } from './components/post'
import fetchUserData from './components/api'
import { handleAttachments } from './components/post';


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


// Revises post such as emojis, replies and images
function addExtraNewline(text: string): string {
  // Use regular expression to find double newline sequences
  let t = text
  t = t.replace(/\n/g, "\n\n");
  return t
}


function revisePost(text: any) {
  let revisedString: any
  revisedString = DiscEmojiSupport(text)
    revisedString = EmojiImage(revisedString)
    var wholeReply = getReply(revisedString)?.replyText
    revisedString = revisedString.replace(wholeReply, "");
    revisedString = addExtraNewline(revisedString)
  const regex = /\[\(sticker\) (.+?): (.+)\]/; 
  const match = revisedString.match(regex);
  if (match) {
    const name = match[1];
    const imageLink = match[2]; 
    revisedString = revisedString.replace(regex, `![${name}](${imageLink})`);
  }
  return revisedString
}


// Post props!
export function PostComponent ({...postProps}) {
  const {
//    id,
    attachments,
//    isDeleted,
    post,
//    pinned,
//    post_id,
//    post_origin,
    time,
//    type,
    user,
    active,
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
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
      return <img src={src} alt={alt} style={{ height: 'auto', width: 'auto', maxWidth: '425px' }} />;
    default:
      return <img src={src} alt={alt} style={{ height: 'auto', width: 'auto', maxWidth: '425px' }} />;
  }
};

var attachment = handleAttachments(attachments)
realPost = realPost + "\n" + "\n" + attachment

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
        <p className="post-username-text"><strong>{realUser}</strong></p>
      </div>
      <div className="post-content">
        <div className="timestamp"><i>{formattedDate}</i></div>
        <div className="postmessage">
        {shouldRender ? (
          <div className="effect"><i>
          <img src={replyPFP} alt="default pfp" width="16" height="16" style={{ paddingRight: 5 }}/>
          {wholeReply} {attachments}</i></div>
        ) : null}   <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          img: ImageRenderer // Tell ReactMarkdown to use ImageRenderer for img tags
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
  console.log((!(data.val._id)) === undefined)
      if ((!(data.val._id)) === false) {
        setPosts((prevPosts) => [data.val, ...prevPosts]);
      } else if (data.cmd === "ulist") {
        const users = data.val.split(';');
        setIsOnline(users);
      }
    };

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
          id={post._id || Math.random().toString(36).substring(7)}
          attachments={post.attachments || []} // Assuming no attachments for now
          isDeleted={post.isDeleted || false} // Set to false explicitly
          post={post.p || ''} // Set empty string for missing post
          pinned={post.pinned || false} // Set to false explicitly
          post_id={post.post_id || 'unknown'} // Set default post_id
          post_origin={post.post_origin || 'unknown'} // Set default post_origin
          time={post.t
            ? {
              mo: parseInt(post.t.mo),
              d: parseInt(post.t.d),
              y: post.t.y,
              h: post.t.h,
              mi: parseInt(post.t.mi),
              s: parseInt(post.t.s),
              e: post.t.e,
            }
            : {
              mo: 0,
              d: 0,
              y: 0,
              h: 0,
              mi: 0,
              s: 0,
              e: 0,
            }}
          type={post.type || 0} // Set default type
          user={post.u || 'unknown'} // Set default user
          active={isOnline.includes(post.p.includes(':') && post.u === 'Discord' ? post.p.split(':')[0] : post.u)}
          />
      ))}

    </div>
  )
}


export default MyComponent;