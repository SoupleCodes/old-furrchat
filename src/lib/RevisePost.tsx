import ReactMarkdown from "react-markdown";
import { emojiData, discordEmojis, PBJTime, defaultPFPS } from "./Data.ts";
import { scrollToPost } from "../components/PostComponent.tsx";
import CustomColor from "./ColorMarkdown.tsx";
import { Link } from "react-router-dom";
import { ImageRenderer } from "../utils/ImageRenderer.tsx"

// Whitelist of trusted hosts
export const hostWhitelist = [
  "https://meower.org/",
  "https://http.meower.org/",
  "https://assets.meower.org/",
  "https://forums.meower.org/",
  "https://go.meower.org/",
  "https://hedgedoc.meower.org/",
  "https://docs.meower.org/",
  "https://uploads.meower.org/",
  "https://u.cubeupload.com/",
  "https://cubeupload.com/",
  "https://i.ibb.co/",
  "https://media.tenor.com/",
  "https://tenor.com/",
  "https://c.tenor.com/",
  "https://assets.scratch.mit.edu/",
  "https://cdn2.scratch.mit.edu/",
  "https://cdn.scratch.mit.edu/",
  "https://uploads.scratch.mit.edu/",
  "https://cdn.discordapp.com/",
  "https://media.discordapp.net/",
];

// Function to check if a URL is in the whitelist
const isWhitelistedURL = (url: string): boolean => hostWhitelist.some(whitelistURL => url.startsWith(whitelistURL));

const convertWhitelistedURLsToImages = (text: string | undefined): string => {
  if (!text) {
    return "";
  }
  return text.replace(/(https:\/\/[^\s]+)/g, (url) =>
    isWhitelistedURL(url) ? `![image](${url})` : url
  );
};

const handleAttachments = (attachments: any[]): string =>
  attachments
    .map(({ id, filename }) => `![](https://uploads.meower.org/attachments/${id}/${filename})`)
    .join(" ");

const replaceWithMarkdown = (
  sentence: string,
  list: { [key: string]: string },
  replacement: (key: string, value: string) => string
): string =>
  Object.keys(list).reduce(
    (acc, key) => acc.replaceAll(key, replacement(key, list[key])),
    sentence
  );

const EmojiImage = (sentence: string, list: { [key: string]: string }, replace: boolean = true): string =>
  replaceWithMarkdown(
    sentence,
    list,
    (key, value) => (replace ? ` ![${key}](${value}) ` : '')
  );

const DataImageToURL = (sentence: string, replace: boolean = true): string =>
  sentence.replace(/(data:image\/[^\s]+;base64,[^\s]+)/g, url =>
    replace ? `![image](${url})` : ''
  );

const extractInfo = (
  text: string
): { name: string; number: string; isAnimated: boolean } | null => {
  const match = text.match(/<(a)?:(\w+):(\d+)>/);
  if (match) {
    return {
      name: match[2],
      number: match[3],
      isAnimated: !!match[1]
    };
  }
  return null;
};

const DiscEmojiSupport = (text: string | undefined, replace: boolean = true): string => {
  if (!text) {
    return "";
}


  return text.replace(/\\?<(a)?:(\w+):(\d+)>/gi, match => {
    if (match.startsWith("\\")) return match.slice(1);
    if (!replace) return '';

    const { name, number, isAnimated } = extractInfo(match) || {};
    return name
      ? `![${name}](https://cdn.discordapp.com/emojis/${number}.${isAnimated ? 'gif' : 'png'}?size=256&quality=lossless)`
      : match;
  });
};


const MeowerEmojiSupport = (text: string): string => {
  if (typeof text !== "string") {
    return "";
  }

  const regex = /\\?<:([a-z0-9]+)>/gi;

  return text.replace(regex, (match) => {
    if (match.startsWith("\\")) {
      return match.substring(1);
    } else {
      const id = match.substring(2, match.length - 1);
      const url = `https://uploads.meower.org/emojis/${id}`
      return `![${id}](${url})`;
    }
  });
}

// Function to render replies
function getReplies(repliesData: any[]) {
  return (
    <div>
      {repliesData.map((reply) => {
        try {
          return (
            <div
              key={reply._id}
              className="reply"
              onClick={() => scrollToPost(reply.post_id)}
              style={{ cursor: 'pointer' }}
            >
              <i>
                {reply.author &&
                  reply.author.avatar !== null &&
                  reply.author.avatar !== undefined ? (
                  <img
                    src={
                      reply.author.avatar === ""
                        ? reply.author.pfp_data === -3
                          ? "/furrchat/assets/default_pfps/icon_guest-e8db7c16.svg"
                          : `${defaultPFPS[reply.author.pfp_data]}`
                        : `https://uploads.meower.org/icons/${reply.author.avatar}`
                    }
                    alt="reply pfp"
                    width="16"
                    height="16"
                    style={{ paddingRight: 5 }}
                  />
                ) : null}
                <Link to={`/users/${reply.u}`}><b>{reply.u}</b></Link>: <ReactMarkdown
                  components={{
                    p: ({ children }) => {
                      if (children && typeof children === 'string') {
                        const text = children.trim();
                        if (text.length > 70) {
                          return <CustomColor>{text.substring(0, 50).replace(/\n/g, '') + "..."}</CustomColor>;
                        } else {
                          return <CustomColor>{text}</CustomColor>;
                        }
                      } else {
                        return <>{children}</>;
                      }
                    },
                // @ts-ignore
                img: ImageRenderer
                  }}
                >
                  {DiscEmojiSupport(MeowerEmojiSupport(reply.p))}
                </ReactMarkdown>
              </i>
            </div>
          );
        } catch (error) {
          console.error("Error rendering reply:", error);
          return null; // Render nothing :)
        }
      })}
    </div>
  );
}

const getReactions = (
  reactionsData: any[], 
  post_id: string | null,
  reactToPost: (post_id: string | null, emoji: string) => void
) => {

  return (
    <div
      style={{
        maxWidth: "750px",
        boxSizing: "content-box",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "2px"
      }}
    >
      {reactionsData.map(({ emoji, count }) => {
        try {
          const isStandardEmoji = isValidEmoji(emoji);
          const emojiContent = isStandardEmoji ? (
            <span style={{ fontSize: "14px" }}>{emoji}</span>
          ) : (
            <img
              src={`https://uploads.meower.org/emojis/${emoji}`}
              alt="Reaction!"
              style={{ height: "14px" }}
            />
          );
  
          return (
            <button
              key={emoji}
              onClick={() => reactToPost(post_id, emoji)} // Pass userToken here
              style={{
                fontSize: "10px",
                fontWeight: "bold",
                background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.6), rgba(153, 153, 133, 0.4))",
                borderWidth: "1px",
                borderRadius: "2px",
                cursor: "pointer",
                position: "relative",
                transition: "background 0.3s, transform 0.1s",
                display: "flex",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.8)";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(to bottom, rgba(255, 255, 255, 0.6), rgba(153, 153, 133, 0.4))";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {emojiContent}
              <span style={{
                position: "absolute",
                bottom: "0px",
                right: "0px",
                fontSize: "8px",
                background: "rgba(255, 255, 255, 0.7)",
                borderRadius: "2px",
                fontWeight: "normal",
                display: "flex",
                padding: "1px",
                color: "black",
              }}>
                {count}
              </span>
            </button>
          );
        } catch (error) {
          console.error("Error rendering reactions:", error);
          return null;
        }
      })}
    </div>
  );
  
};


const isValidEmoji = (emoji: string): boolean =>
  /\p{Emoji_Presentation}/u.test(emoji);

const revisePost = (text: string): string => {
  let revisedString = text;
  convertWhitelistedURLsToImages(revisedString);

  revisedString = DiscEmojiSupport(revisedString);
  revisedString = MeowerEmojiSupport(revisedString);
  revisedString = EmojiImage(revisedString, emojiData);
  revisedString = EmojiImage(revisedString, PBJTime);
  revisedString = DataImageToURL(revisedString);

  revisedString = revisedString.replace(/\[\(sticker\) (.+?): (.+)\]/, (_, name, imageLink) => `![${name}](${imageLink})`);

  revisedString = replaceWithMarkdown(revisedString, discordEmojis, (_key, value) => value);
  revisedString = replaceWithMarkdown(revisedString, PBJTime, (_key, value) => value);
  revisedString = revisedString.replace(/(^|\s)@([a-zA-Z0-9_-]+)([\s,.]|$)/g, '$1[@$2](/furrchat/#/users/$2)$3');

  return revisedString.replace(/\n/g, '\n\n');
};

export {
  EmojiImage,
  DiscEmojiSupport,
  MeowerEmojiSupport,
  handleAttachments,
  getReplies,
  revisePost,
  extractInfo,
  getReactions,
  replaceWithMarkdown
};