// Import necessary stuff
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'


// Replaces their text counterpart with the image counterpart
type EmojiMap = { [key: string]: string }; // Interface for emoji key-value pairs

const emojiData: EmojiMap = {
  "lick": "furrchat/public/assets/smilies/a_puh.gif",
  "ban": "furrchat/public/assets/smilies/ban.gif",
  "bday": "furrchat/public/assets/smilies/bdaybiggrin.gif",
  "beer": "furrchat/public/assets/smilies/bier.gif",
  "chubby": "furrchat/public/assets/smilies/chubby.gif",
  "clown": "furrchat/public/assets/smilies/clown.gif",
  "confused": "furrchat/public/assets/smilies/confused.gif",
  "cool": "furrchat/public/assets/smilies/coool.gif",
  "devilwhip": "furrchat/public/assets/smilies/devil_whip.gif",
  "devil": "furrchat/public/assets/smilies/devil.gif",
  "spain": "furrchat/public/assets/smilies/es.gif",
  "finland": "furrchat/public/assets/smilies/fi.gif",
  "france": "furrchat/public/assets/smilies/fr.gif",
  "frown": "furrchat/public/assets/smilies/frown.gif",
  "frusty": "furrchat/public/assets/smilies/frusty.gif",
  "fyou": "furrchat/public/assets/smilies/fyou.gif",
  "hooligan": "furrchat/public/assets/smilies/got-hooligan.gif",
  "headshake_fast": "furrchat/public/assets/smilies/headshakesmile-fast.gif",
  "hypocrite": "furrchat/public/assets/smilies/hypocrite2.gif",
  "king": "furrchat/public/assets/smilies/koning.gif",
  "southkorea": "furrchat/public/assets/smilies/kr.png",
  "drool": "furrchat/public/assets/smilies/kwijl.gif",
  "list": "furrchat/public/assets/smilies/lijstje.gif",
  "loveit": "furrchat/public/assets/smilies/loveit.gif",
  "lurk": "furrchat/public/assets/smilies/lurk.gif",
  "marry": "furrchat/public/assets/smilies/marrysmile.gif",
  "noo": "furrchat/public/assets/smilies/nooo.gif",
  "nothumbs": "furrchat/public/assets/smilies/nosthumbs.gif",
  "offtopic": "furrchat/public/assets/smilies/offtopic.gif",
  "service": "furrchat/public/assets/smilies/pimatyourservice.gif",
  "poland": "furrchat/public/assets/smilies/pl.png",
  "plzdie": "furrchat/public/assets/smilies/plzdie.gif",
  "puh": "furrchat/public/assets/smilies/puh.gif",
  "puh2": "furrchat/public/assets/smilies/puh2.gif",
  "puhbye": "furrchat/public/assets/smilies/puhbye.gif",
  "puke": "furrchat/public/assets/smilies/pukey.gif",
  "cow": "furrchat/public/assets/smilies/rc5.gif",
  "redcard": "furrchat/public/assets/smilies/redcard.gif",
  "bored": "furrchat/public/assets/smilies/saai.gif",
  "shiny": "furrchat/public/assets/smilies/shiny.gif",
  "sleeping": "furrchat/public/assets/smilies/slapen.gif",
  "zzz": "furrchat/public/assets/smilies/sleepey.gif",
  "sleephappy": "furrchat/public/assets/smilies/sleephappy.gif",
  "smile": "furrchat/public/assets/smilies/smile.gif",
  "snap": "furrchat/public/assets/smilies/smiliecam.gif",
  "steam": "furrchat/public/assets/smilies/steam.gif",
  "toilet_puke": "furrchat/public/assets/smilies/toilet-puke.gif",
  "wink": "furrchat/public/assets/smilies/wink.gif",
  "winkthumbs": "furrchat/public/assets/smilies/winkthumbs.gif",
  "worship": "furrchat/public/assets/smilies/worshippy.gif",
  "yawn": "furrchat/public/assets/smilies/yawnee.gif",
  "yes": "furrchat/public/assets/smilies/yes.gif",
  "yum": "furrchat/public/assets/smilies/yummie.gif",
  "zoom": "furrchat/public/assets/smilies/zoefzoef.gif",
  "grass": "furrchat/public/assets/smilies_minecraft/grass.png",
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

function fetchUserData(user: string) {
  fetch(user)
    .then((response) => response.json())
    .then((data) => {
      userData.push(data._id);
    })
    .catch((error) => {
      console.error('Error fetching user data:', error);
    });
}


function getReply(post: string, get?: string): string | any {
  const regex = /@(\w+)\s+"([^"]+)"\s+\(([\da-f-]+)\)/;
  const match = post.match(regex);

  if (match) {
    if (get === 'user') {
      return match[1];
    } else if (get === 'replyContent') {
      return match[2];
    } else if (get === 'uuid') {
      return match[3];
    } else {
      return match[0];
    }
  }

  return null; // Return null if no match is found
}

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
    var wholeReply = getReply(revisedString)
    revisedString = revisedString.replace(wholeReply, "");
    return revisedString;

}

function getUserData(searchField: keyof User, searchValue: string, userData: User[]): User | undefined {
  return userData.find((user) => user[searchField] === searchValue);
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

const username = new String(getReply(post, 'user'));
const replyContent = new String(getReply(post, 'replyContent'));
const wholeReply = `@${username}: "${replyContent}"`;
fetchUserData(`https://api.meower.org/users/${user}`)
var pfp = getUserData(user, 'avatar', userData)?.avatar;
pfp = `https://uploads.meower.org/icons/${pfp}` || `/public/assets/default.png`;
console.log(pfp)

const ImageRenderer = ({ src, alt }:any) => {
  return <img src={src} alt={alt} style={{ width: '12px', height: 'auto' }} />;
};

return (
    <div className="container">
      <div className="user">
        <img src={"https://alliedhealth.ouhsc.edu/Portals/1058/EasyDNNNews/4317/images/nophoto_large-300-350-c-C-95.png"} alt="default pfp" className="post-pfp" width="48" height="48" style={{ padding: 5 }} />
        <p className="post-username-text"><strong>{user}</strong></p>
      </div>
      <div className="post-content">
        <div className="timestamp"><i>{formattedDate}</i></div>
        <div className="postmessage">
        {shouldRender ? (
          <div className="effect"><i>
          <img src={"https://alliedhealth.ouhsc.edu/Portals/1058/EasyDNNNews/4317/images/nophoto_large-300-350-c-C-95.png"} alt="default pfp" className="post-pfp" width="8" height="8" style={{ paddingRight: '4px', boxShadow: 'inset 0 0 1.6px rgba(0, 0, 0, 0.1)'}} />
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

