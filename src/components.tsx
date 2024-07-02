// Import necessary stuff
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'


// Replaces their text counterpart with the image counterpart
type EmojiMap = { [key: string]: string }; // Interface for emoji key-value pairs

const emojiData: EmojiMap = {
  "lick": "/furrchat/assets/smilies/a_puh.gif",
  "ban": "/furrchat/assets/smilies/ban.gif",
  "bday": "/furrchat/assets/smilies/bdaybiggrin.gif",
  "beer": "/furrchat/assets/smilies/bier.gif",
  "chubby": "/furrchat/assets/smilies/chubby.gif",
  "clown": "/furrchat/assets/smilies/clown.gif",
  "confused": "/furrchat/assets/smilies/confused.gif",
  "cool": "/furrchat/assets/smilies/coool.gif",
  "devilwhip": "/furrchat/assets/smilies/devil_whip.gif",
  "devil": "/furrchat/assets/smilies/devil.gif",
  "spain": "/furrchat/assets/smilies/es.gif",
  "finland": "/furrchat/assets/smilies/fi.gif",
  "france": "/furrchat/assets/smilies/fr.gif",
  "frown": "/furrchat/assets/smilies/frown.gif",
  "frusty": "/furrchat/assets/smilies/frusty.gif",
  "fyou": "/furrchat/assets/smilies/fyou.gif",
  "hooligan": "/furrchat/assets/smilies/got-hooligan.gif",
  "headshake_fast": "/furrchat/assets/smilies/headshakesmile-fast.gif",
  "hypocrite": "/furrchat/assets/smilies/hypocrite2.gif",
  "king": "/furrchat/assets/smilies/koning.gif",
  "southkorea": "/furrchat/assets/smilies/kr.png",
  "drool": "/furrchat/assets/smilies/kwijl.gif",
  "list": "/furrchat/assets/smilies/lijstje.gif",
  "loveit": "/furrchat/assets/smilies/loveit.gif",
  "lurk": "/furrchat/assets/smilies/lurk.gif",
  "marry": "/furrchat/assets/smilies/marrysmile.gif",
  "noo": "/furrchat/assets/smilies/nooo.gif",
  "nothumbs": "/furrchat/assets/smilies/nosthumbs.gif",
  "offtopic": "/furrchat/assets/smilies/offtopic.gif",
  "service": "/furrchat/assets/smilies/pimatyourservice.gif",
  "poland": "/furrchat/assets/smilies/pl.png",
  "plzdie": "/furrchat/assets/smilies/plzdie.gif",
  "puh": "/furrchat/assets/smilies/puh.gif",
  "puh2": "/furrchat/assets/smilies/puh2.gif",
  "puhbye": "/furrchat/assets/smilies/puhbye.gif",
  "puke": "/furrchat/assets/smilies/pukey.gif",
  "cow": "/furrchat/assets/smilies/rc5.gif",
  "redcard": "/furrchat/assets/smilies/redcard.gif",
  "bored": "/furrchat/assets/smilies/saai.gif",
  "shiny": "/furrchat/assets/smilies/shiny.gif",
  "sleeping": "/furrchat/assets/smilies/slapen.gif",
  "zzz": "/furrchat/assets/smilies/sleepey.gif",
  "sleephappy": "/furrchat/assets/smilies/sleephappy.gif",
  "smile": "/furrchat/assets/smilies/smile.gif",
  "snap": "/furrchat/assets/smilies/smiliecam.gif",
  "steam": "/furrchat/assets/smilies/steam.gif",
  "toilet_puke": "/furrchat/assets/smilies/toilet-puke.gif",
  "wink": "/furrchat/assets/smilies/wink.gif",
  "winkthumbs": "/furrchat/assets/smilies/winkthumbs.gif",
  "worship": "/furrchat/assets/smilies/worshippy.gif",
  "yawn": "/furrchat/assets/smilies/yawnee.gif",
  "yes": "/furrchat/assets/smilies/yes.gif",
  "yum": "/furrchat/assets/smilies/yummie.gif",
  "zoom": "/furrchat/assets/smilies/zoefzoef.gif",
  "grass": "/furrchat/assets/smilies_minecraft/grass.png",
};

type User = {
  "_id": string,
  "avatar": string,
  "avatar_color": string,
  "banned": boolean,
  "created": number,
  "error": boolean,
  "flags": number,
  "last_seen": number,
  "lower_username": string,
  "lvl": number,
  "permissions": number,
  "pfp_data": number,
  "quote": string,
  "uuid": string
}

const userData: User[] = [];

function fetchUserData(user: string, find: keyof User) {
  const foundUser = userData.find(u => u._id === user);
  if (foundUser) {
    console.log("User data already exists for:", user);
    return foundUser[find];
  } else {
    // Fetch from API only if user data is not in local database
    fetch(`https://api.meower.org/users/${user}`)
      .then((response) => response.json())
      .then((data: User) => {
        userData.push(data);
        return (data as User)[find];
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        return null;
      });
  }
}



type Reply = {
  id: string;
  postContent: string;
  replyText: string;
};

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


const EmojiImage = (text: string): string => {
  const emojiRegex = /:\b(.+?)\b:/g;
  return text.replace(emojiRegex, (match, emojiKey) => {
    const lowercaseEmojiKey = emojiKey.toLowerCase(); 
    if (emojiData.hasOwnProperty(lowercaseEmojiKey)) {
      const emojiPath = emojiData[lowercaseEmojiKey];
      return `![${emojiKey}](${emojiPath})`; // Markdown image syntax
    } else {
      return match; 
    }
  });
};

const extractInfo = (text: string): { name: string; number: string; isAnimated: boolean } | null => {
  const match = text.match(/<(a)?:(\w+):(\d+)>/);
  return match ? { name: match[2], number: match[3], isAnimated: !!match[1] } : null;
};


const DiscEmojiSupport = (text: string): string => {
  const regex = /<(a)?:(\w+):(\d+)>/gi;

  return text.replace(regex, function(text) {
    const info = extractInfo(text);

    if (info) {
      const url = `https://cdn.discordapp.com/emojis/${info.number}.${info.isAnimated ? 'gif' : 'png'}?size=16&quality=lossless`;
      return `![${info.name}](${url})`;
    } else {
      return text;
    }
  });
};


// Revises post
function revisePost(text: any) {
  let revisedString: any
  revisedString = DiscEmojiSupport(text)
    revisedString = EmojiImage(revisedString)
    var wholeReply = getReply(revisedString)?.replyText
    revisedString = revisedString.replace(wholeReply, "");
    return revisedString;

}


// Renders the post using the data from the postProps
export function PostComponent ({...postProps}) {
  const {
//    id,
//    attachments,
//    isDeleted,
    post,
//    pinned,
//    post_id,
//    post_origin,
    time,
//    type,
    user
  } = postProps;

  
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
  
  var shouldRender;
  var postReply = getReply(post)
  if (postReply === null) {
    shouldRender = false;
  } else {
    shouldRender = true;
}

const wholeReply = postReply?.replyText;
var pfp = (fetchUserData(user, 'avatar'))?.toString();
console.log(pfp)
if (pfp === "") {
  pfp = "furrchat/assets/default.png"
} else {
  pfp = `https://uploads.meower.org/icons/${pfp}`
}

// var avatar_color = (fetchUserData(user, 'avatar_color'))?.toString();
// avatar_color = `#${avatar_color}`
// console.log(avatar_color)
const ImageRenderer = ({ src, alt }:any) => {
  return <img src={src} alt={alt} style={{ height: '3%', width: 'auto' }} />;
};

return (
    <div className="container">
      <div className="user">
        <img src={pfp} alt="pfp" className="post-pfp" width="48" height="48" style={{ padding: 5 }} />
        <p className="post-username-text"><strong>{user}</strong></p>
      </div>
      <div className="post-content">
        <div className="timestamp"><i>{formattedDate}</i></div>
        <div className="postmessage">
        {shouldRender ? (
          <div className="effect"><i>
          <img src={"furrchat/assets/default.png"} alt="default pfp" className="post-pfp" width="8" height="8" style={{ paddingRight: '4px', boxShadow: 'inset 0 0 1.6px rgba(0, 0, 0, 0.1)'}} />
          {wholeReply}</i></div>
        ) : null}   <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          img: ImageRenderer // Tell ReactMarkdown to use ImageRenderer for img tags
        }}
      >
        {revisePost(post)} 
      </ReactMarkdown>
        
        </div>
          </div>
      </div>
  );
}



// Recieves posts from the server and passes the data as props

const ws = new WebSocket('wss://server.meower.org');

const MyComponent = () => {
  var [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    ws.onmessage = (message) => {
      console.log('Received message:', message.data);
      const data = JSON.parse(message.data);

 
      if ("_id" in data.val) {
        setPosts((prevPosts) => [data.val, ...prevPosts]);
      } else if ("update_post" in data.val) {
        console.log(data)
      } else if ("delete" in data.val) {
 
      }
    };
// {"cmd": "direct", "val": {"mode": "delete", "id": "2fde958f-a8f4-47da-bb73-54554238fe68"}}

    return () => {
      ws.onmessage = null; 
    };
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('https://api.meower.org/home');
        if (response.ok) {
          const data = await response.json();
          console.log(data)
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
          id={post._id || 'unknown'}
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
        />
      ))}

    </div>
  )
}


export default MyComponent;

