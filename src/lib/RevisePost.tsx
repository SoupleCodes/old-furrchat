import { emojiData, discordEmojis, PBJTime, defaultPFPS } from "./Data.ts";

// Function to handle attachments and return markdown image elements
const handleAttachments = (attachments: any[]): string => {
  try {
    return attachments
      .map(
        (attachment) =>
          `![](https://uploads.meower.org/attachments/${attachment.id}/${attachment.filename})`
      )
      .join(" ");
  } catch (error) {
    console.error("Error handling attachments:", error);
    return "";
  }
};

// Function to replace emoji keys in a sentence with corresponding markdown image syntax
const EmojiImage = (sentence: string, list: { [x: string]: any }, replace: boolean = true): string => {
  for (const key in list) {
    if (sentence.includes(key) && !sentence.includes("\\" + key)) {
      const value = list[key];
      if (replace) {
        sentence = sentence.replaceAll(key, ` ![${key}](${value}) `);
      } else {
        sentence = sentence.replaceAll(key, '');
      }
    }
  }
  return sentence;
};


const DataImageToURL = (sentence: string, replace: boolean = true): string => {
  // Regular expression to match URLs
  const urlRegex = /(data:image\/[^\s]+;base64,[^\s]+)/g;

  // Replace URLs in the sentence with markdown image syntax
  sentence = sentence.replace(urlRegex, (url) => {
    if (replace) {
      return `![image](${url})`;
    } else {
      return ''; // Remove the URL if replace is false
    }
  });

  // Return the modified sentence
  return sentence;
};


// Extracts information from a text that matches a Discord emoji pattern
const extractInfo = (
  text: string
): { name: string; number: string; isAnimated: boolean } | null => {
  const match = text.match(/<(a)?:(\w+):(\d+)>/);
  return match
    ? { name: match[2], number: match[3], isAnimated: !!match[1] }
    : null;
};

// Function to replace keys in a sentence with provided key-value pairs
const replaceKeysWithValues = (
  sentence: string,
  keyValuePairs: { [key: string]: string }
): string => {
  for (const key in keyValuePairs) {
    if (sentence.includes(key) && !sentence.includes("\\" + key)) {
      const value = keyValuePairs[key];
      sentence = sentence.replaceAll(key, value);
    }
  }
  return sentence;
};

// Function to support Discord emojis in text, replacing them with markdown image syntax
const DiscEmojiSupport = (text: string, replace: boolean = true): string => {
  if (typeof text !== "string") {
    return "";
  }

  const regex = /\\?<(a)?:(\w+):(\d+)>/gi; // Match optional backslash

  return text.replace(regex, (match) => {
    if (match.startsWith("\\")) {
      return match.substring(1); // Return the emoji as plain text (remove backslash)
    } else if (replace) {
      const info = extractInfo(match);

      if (info) {
        const url = `https://cdn.discordapp.com/emojis/${info.number}.${
          info.isAnimated ? "gif" : "png"
        }?size=16&quality=lossless`;
        return `![${info.name}](${url})`;
      } else {
        return match; // Return the original match if no info is found
      }
    } else {
      return ''; // Remove the Discord emoji if replace is false
    }
  });
};

const MeowerEmojiSupport = (text: string): string => {
  if (typeof text !== "string") {
    return "";
  }

  // i.e. <:0idbmJ1EDIuLcK7gRsDqse8y>
  const regex = /\\?<:([a-z0-9]+)>/gi; // backslash support
  
  return text.replace(regex, (match) => {
    if (match.startsWith("\\")) {
      return match.substring(1); // plain text
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
            <div key={reply._id} className="reply">
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
                <b>{reply.u}</b>: {reply.p}
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

function getReactions(reactionsData: any[]) {
  return (
    <div style={{ maxWidth: "750px" }}>
      {reactionsData.map((reactions) => {
        try {
          let emojiContent;
          if (isValidEmoji(reactions.emoji)) {
            emojiContent = reactions.emoji; // Render standard emoji directly
          } else {
            emojiContent = (
              <img
                src={`https://uploads.meower.org/emojis/${reactions.emoji}`}
                alt="Reaction!"
                style={{ height: "10px" }}
              />
            );
          }
          return (
            <button
              key={reactions.emoji} // Ensure each button has a unique key
              style={{
                padding: "5px",
                fontSize: "8px",
                fontWeight: "bold",
                boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
                background:
                  "linear-gradient(to bottom,rgba(255, 255, 255, 0.3), rgba(153, 153, 133, 0.3))",
                border: "1px solid rgba(0, 0, 0, 0.2)",
              }}
            >
              {emojiContent} {reactions.count}
            </button>
          );
        } catch (error) {
          console.error("Error rendering reactions:", error);
          return null; // Render nothing in case of error
        }
      })}
    </div>
  );
}

// Function to check if emoji is valid
function isValidEmoji(emoji: string) {
  return emoji.match(/\p{Emoji_Presentation}/gu) !== null;
}

// Function to revise a post by applying various transformations
function revisePost(text: any): string {
  let revisedString = text;

  revisedString = DiscEmojiSupport(revisedString);
  revisedString = MeowerEmojiSupport(revisedString);
  revisedString = EmojiImage(revisedString, emojiData);
  revisedString = EmojiImage(revisedString, PBJTime);
  revisedString = DataImageToURL(revisedString);

  const regex = /\[\(sticker\) (.+?): (.+)\]/;
  const match = revisedString.match(regex);

  if (match) {
    const name = match[1];
    const imageLink = match[2];
    revisedString = revisedString.replace(regex, `![${name}](${imageLink})`);
  }

  revisedString = replaceKeysWithValues(revisedString, discordEmojis);
  revisedString = replaceKeysWithValues(revisedString, PBJTime);
  revisedString = revisedString.replace(/\n/g, "\n\n");

  return revisedString;
}

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
