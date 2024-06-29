// Import necessary stuff
import { useState, useEffect } from 'react';
import { z } from "zod";




// The data the post contains ig
const postProps = z.object({
  id: z.string(),
  attachments: z.array(z.string()),
  isDeleted: z.boolean(),
  post: z.string(),
  pinned: z.boolean(),
  post_id: z.string(),
  post_origin: z.string(),
  time: z.object({
    mo: z.number(),
    d: z.number(),
    y: z.number(),
    h: z.number(),
    mi: z.number(),
    s: z.number(),
    e: z.number(),
  }),
  type: z.number(),
  user: z.string(),
})


// Replaces their text counterpart with the image counterpart
type EmojiMap = { [key: string]: string }; // Interface for emoji key-value pairs

const emojiData: EmojiMap = {
  "lick": "./src/assets/smilies/a_puh.gif",
  "ban": "./src/assets/smilies/ban.gif",
  "bday": "./src/assets/smilies/bdaybiggrin.gif",
  "beer": "./src/assets/smilies/bier.gif",
  "chubby": "./src/assets/smilies/chubby.gif",
  "clown": "./src/assets/smilies/clown.gif",
  "confused": "./src/assets/smilies/confused.gif",
  "cool": "./src/assets/smilies/coool.gif",
  "devilwhip": "./src/assets/smilies/devil_whip.gif",
  "devil": "./src/assets/smilies/devil.gif",
  "spain": "./src/assets/smilies/es.gif",
  "finland": "./src/assets/smilies/fi.gif",
  "france": "./src/assets/smilies/fr.gif",
  "frown": "./src/assets/smilies/frown.gif",
  "frusty": "./src/assets/smilies/frusty.gif",
  "fyou": "./src/assets/smilies/fyou.gif",
  "hooligan": "./src/assets/smilies/got-hooligan.gif",
  "headshake_fast": "./src/assets/smilies/headshakesmile-fast.gif",
  "hypocrite": "./src/assets/smilies/hypocrite2.gif",
  "king": "./src/assets/smilies/koning.gif",
  "southkorea": "./src/assets/smilies/kr.png",
  "drool": "./src/assets/smilies/kwijl.gif",
  "list": "./src/assets/smilies/lijstje.gif",
  "loveit": "./src/assets/smilies/loveit.gif",
  "lurk": "./src/assets/smilies/lurk.gif",
  "marry": "./src/assets/smilies/marrysmile.gif",
  "noo": "./src/assets/smilies/nooo.gif",
  "nothumbs": "./src/assets/smilies/nosthumbs.gif",
  "offtopic": "./src/assets/smilies/offtopic.gif",
  "service": "./src/assets/smilies/pimatyourservice.gif",
  "poland": "./src/assets/smilies/pl.png",
  "plzdie": "./src/assets/smilies/plzdie.gif",
  "puh": "./src/assets/smilies/puh.gif",
  "puh2": "./src/assets/smilies/puh2.gif",
  "puhbye": "./src/assets/smilies/puhbye.gif",
  "puke": "./src/assets/smilies/pukey.gif",
  "cow": "./src/assets/smilies/rc5.gif",
  "redcard": "./src/assets/smilies/redcard.gif",
  "bored": "./src/assets/smilies/saai.gif",
  "shiny": "./src/assets/smilies/shiny.gif",
  "sleeping": "./src/assets/smilies/slapen.gif",
  "zzz": "./src/assets/smilies/sleepey.gif",
  "sleephappy": "./src/assets/smilies/sleephappy.gif",
  "smile": "./src/assets/smilies/smile.gif",
  "snap": "./src/assets/smilies/smiliecam.gif",
  "steam": "./src/assets/smilies/steam.gif",
  "toilet_puke": "./src/assets/smilies/toilet-puke.gif",
  "wink": "./src/assets/smilies/wink.gif",
  "winkthumbs": "./src/assets/smilies/winkthumbs.gif",
  "worship": "./src/assets/smilies/worshippy.gif",
  "yawn": "./src/assets/smilies/yawnee.gif",
  "yes": "./src/assets/smilies/yes.gif",
  "yum": "./src/assets/smilies/yummie.gif",
  "zoom": "./src/assets/smilies/zoefzoef.gif",
  "mc": "./src/assets/smilies/minecraft.png",

};

const EmojiImage = (text: string): string => {
  const emojiRegex = /:([^:]+?):/g;

  return text.replace(emojiRegex, (match, emojiKey) => {
    const lowercaseEmojiKey = emojiKey.toLowerCase(); // Convert captured key to lowercase

    if (emojiData.hasOwnProperty(lowercaseEmojiKey)) {
      const emojiPath = emojiData[lowercaseEmojiKey];
      return `<img src="${emojiPath}" alt="${emojiKey}" id="emoji"/>`;

    } else {
      return match;

    }
  });
};

// Revises post
function revisePost(text: any) {
  return EmojiImage(text);
}

// replace
// S U P P O S E D to render the post using the data from the postProps
export function PostComponent({...postProps}) {
  const {
    id,
    attachments,
    isDeleted,
    post,
    pinned,
    post_id,
    post_origin,
    time,
    type,
    user
  } = postProps;

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const date = new Date(time.y, time.mo - 1, time.d);
  const dayOfWeek = daysOfWeek[date.getDay()];
  const month = months[time.mo]
  if (time.h > 11) {
    var period = 'PM'
  } else {
    var period = 'AM'
  }


  return (
    <div className="container">
      <div className="user">
        <img src={"https://alliedhealth.ouhsc.edu/Portals/1058/EasyDNNNews/4317/images/nophoto_large-300-350-c-C-95.png"} alt="default pfp" className="post-pfp" width="72" height="72" style={{ padding: 5 }} />
        <p className="post-username-text"><strong>{user}</strong></p>
      </div>
      <div className="post-content">
        <div className="timestamp"><i>{dayOfWeek}, {month} {time.d}, {time.y} at {time.h}:{time.mi}:{time.s} {period}</i></div>
        <div className="postmessage" dangerouslySetInnerHTML={{ __html: revisePost(post) }} />
          </div>
      </div>
  );
}


// Recieves posts from the server and passes the data into the <PostComponent />
const ws = new WebSocket('wss://server.meower.org');

const MyComponent = () => {
  const [posts, setPosts] = useState([]); // State to hold posts
  
  
  // useEffect for handling websocket messages
  useEffect(() => {
    ws.onmessage = (message) => {
      console.log('Received message:', message.data);
      const data = JSON.parse(message.data);

      const expectedKey = "_id";

      // Access data within the "val" property if it exists
      if (expectedKey in data.val) {
        setPosts((prevPosts) => [data, ...prevPosts]);
      } else {
        console.warn(`Received data missing expected key: ${expectedKey}`);
      }
    };


    return () => {
      ws.onmessage = null; 
    };
  }, []);

  return (
    <div>
            {posts.map((post) => (
     <PostComponent
          id="someid"
          key={post.val?._id || 'unknown'} // Use optional chaining for _id
          attachments={post.val?.attachments || []} // Assuming no attachments for now
          isDeleted={post.val?.isDeleted || false} // Set to false explicitly
          post={post.val?.p || ''} // Set empty string for missing post
          pinned={post.val?.pinned || false} // Set to false explicitly
          post_id={post.val?.post_id || 'unknown'} // Set default post_id
          post_origin={post.val?.post_origin || 'unknown'} // Set default post_origin
          time={post.val?.t
            ? {
              mo: parseInt(post.val.t.mo),
              d: parseInt(post.val.t.d),
              y: post.val.t.y,
              h: post.val.t.h,
              mi: parseInt(post.val.t.mi),
              s: parseInt(post.val.t.s),
              e: post.val.t.e,
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
          type={post.val?.type || 0} // Set default type
          user={post.val?.u || 'unknown'} // Set default user
        />
      ))}

    </div>
  )
}



export default MyComponent;


