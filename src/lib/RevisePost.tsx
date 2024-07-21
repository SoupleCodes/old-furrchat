import { emojiData, discordEmojis } from "./Data.ts";

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
const EmojiImage = (sentence: string): string => {
  for (const key in emojiData) {
    if (sentence.includes(key) && !sentence.includes("\\" + key)) {
      const value = emojiData[key];
      sentence = sentence.replaceAll(key, `![${key}](${value})`);
    }
  }
  return sentence;
};

const DataImageToURL = (sentence: string): string => {
  // Regular expression to match URLs
  const urlRegex = /(data:image\/[^\s]+;base64,[^\s]+)/g;

  // Replace URLs in the sentence with markdown image syntax
  sentence = sentence.replace(urlRegex, (url) => {
    return `![image](${url})`;
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
const DiscEmojiSupport = (text: string): string => {
  if (typeof text !== "string") {
    return "";
  }

  const regex = /\\?<(a)?:(\w+):(\d+)>/gi; // Match optional backslash

  return text.replace(regex, (match) => {
    if (match.startsWith("\\")) {
      return match.substring(1); // Return the emoji as plain text (remove backslash)
    } else {
      const info = extractInfo(match);

      if (info) {
        const url = `https://cdn.discordapp.com/emojis/${info.number}.${
          info.isAnimated ? "gif" : "png"
        }?size=16&quality=lossless`;
        return `![${info.name}](${url})`;
      } else {
        return match; // Return the original match if no info is found
      }
    }
  });
};

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
                    src={`https://uploads.meower.org/icons/${reply.author.avatar}`}
                    alt="reply pfp"
                    width="16"
                    height="16"
                    style={{ paddingRight: 5 }}
                  />
                ) : null}
                {reply.u}: {reply.p}
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
          return (
            <button
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
              {reactions.emoji} {reactions.count}
            </button>
          );
        } catch (error) {
          console.error("Error rendering reactions:", error);
          return null; // Render nothing of course :)
        }
      })}
    </div>
  );
}

// Function to revise a post by applying various transformations
function revisePost(text: any): string {
  let revisedString = text;

  revisedString = DiscEmojiSupport(revisedString);
  revisedString = EmojiImage(revisedString);
  revisedString = DataImageToURL(revisedString);

  const regex = /\[\(sticker\) (.+?): (.+)\]/;
  const match = revisedString.match(regex);

  if (match) {
    const name = match[1];
    const imageLink = match[2];
    revisedString = revisedString.replace(regex, `![${name}](${imageLink})`);
  }

  revisedString = replaceKeysWithValues(revisedString, discordEmojis);
  revisedString = revisedString.replace(/\n/g, "\n\n");

  return revisedString;
}

export {
  EmojiImage,
  DiscEmojiSupport,
  handleAttachments,
  getReplies,
  revisePost,
  extractInfo,
  getReactions,
};