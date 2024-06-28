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


// Markdown
function markDownIt(string: string) {
  var markdown = require("markdown").markdown;
  return markdown.toHTML(string);
}


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
  const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const date = new Date(time.y, time.mo - 1, time.d);
  const dayOfWeek = daysOfWeek[date.getDay()];

  return (
    <div className="container">
      <div className="user">
        <img src={"https://alliedhealth.ouhsc.edu/Portals/1058/EasyDNNNews/4317/images/nophoto_large-300-350-c-C-95.png"} alt="default pfp" className="post-pfp" width="72" height="72" style={{ padding: 5 }} />
        <p className="post-username-text"><strong>{user}</strong></p>
      </div>
      <div className="post-content">
        <div className="timestamp"><i>{dayOfWeek}, {time.mo} {time.d}, {time.y} at {time.h}:{time.mi}:{time.s} PM</i></div>
        <div className="postmessage">{post}</div>
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
      const newPosts = data;
      if (expectedKey in data.val) {
        setPosts((prevPosts) => [...prevPosts, data]);
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





/*const Post = ({ id, attachments, isDeleted, post, pinned, post_id, post_origin, time, type, user }) => {
  const markdown = require("markdown").markdown;

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const date = new Date(time.y, time.mo - 1, time.d); // Note: Months are 0-indexed in JavaScript Date
  const dayOfWeek = daysOfWeek[date.getDay()];

  return (
    <div className="container">
      <div className="user">
        <img src={"https://alliedhealth.ouhsc.edu/Portals/1058/EasyDNNNews/4317/images/nophoto_large-300-350-c-C-95.png"} alt="default pfp" className="post-pfp" width="72" height="72" style={{ padding: 5 }} />
        <p className="post-username-text"><strong>{user}</strong></p>
      </div>
      <div className="post-content">
        <div className="timestamp"><i>{dayOfWeek}, {time.mo} {time.d}, {time.y}  at {time.h}:{time.mi}:{time.s} PM</i></div>
        <div className="postmessage"> {markdown.toHTML(post)} </div>
      </div>
    </div>
  )

};*/