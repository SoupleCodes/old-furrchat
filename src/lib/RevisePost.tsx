import ReactMarkdown from "react-markdown";
import { emojiData, discordEmojis, PBJTime, defaultPFPS } from "./Data.ts";
import { scrollToPost } from "../components/PostComponent.tsx";
import CustomColor from "./ColorMarkdown.tsx";
import { Link } from "react-router-dom";

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
const isWhitelistedURL = (url: string): boolean =>
  hostWhitelist.some(whitelistURL => url.startsWith(whitelistURL));

const convertWhitelistedURLsToImages = (text: string): string =>
  text.replace(/(https:\/\/[^\s]+)/g, (url) =>
    isWhitelistedURL(url) ? `![image](${url})` : url
  );

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

const DiscEmojiSupport = (text: string, replace: boolean = true): string =>
  text.replace(/\\?<(a)?:(\w+):(\d+)>/gi, match => {
    if (match.startsWith("\\")) return match.slice(1);
    if (!replace) return '';
    const { name, number, isAnimated } = extractInfo(match) || {};
    return name
      ? `![${name}](https://cdn.discordapp.com/emojis/${number}.${isAnimated ? 'gif' : 'png'}?size=16&quality=lossless)`
      : match;
  });

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

const getReactions = (reactionsData: any[]) => (
  <div style={{ maxWidth: "750px" }}>
    {reactionsData.map(({ emoji, count }) => {
      try {
        const isStandardEmoji = isValidEmoji(emoji);
        const emojiContent = isStandardEmoji
          ? emoji
          : <img src={`https://uploads.meower.org/emojis/${emoji}`} alt="Reaction!" style={{ height: "10px" }} />;

        return (
          <button
            key={emoji}
            style={{
              padding: "5px",
              fontSize: "8px",
              fontWeight: "bold",
              boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
              background: "linear-gradient(to bottom,rgba(255, 255, 255, 0.3), rgba(153, 153, 133, 0.3))",
              border: "1px solid rgba(0, 0, 0, 0.2)"
            }}
          >
            {emojiContent} {count}
          </button>
        );
      } catch (error) {
        console.error("Error rendering reactions:", error);
        return null;
      }
    })}
  </div>
);

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
};