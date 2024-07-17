import { emojiData, discordEmojis } from './Data.ts';

// Function to handle attachments and return markdown image elements
const handleAttachments = (attachments: any[]): string => {
  try {
    return attachments.map((attachment) => `![](https://uploads.meower.org/attachments/${attachment.id}/${attachment.filename})`).join(' ');
  } catch (error) {
    console.error("Error handling attachments:", error);
    return "";
  }
};

// Function to replace emoji keys in a sentence with corresponding markdown image syntax
const EmojiImage = (sentence: string): string => {
  for (const key in emojiData) {
    if (sentence.includes(key) && !sentence.includes('\\' + key)) {
      const value = emojiData[key];
      sentence = sentence.replaceAll(key, `![${key}](${value})`);
    }
  }
  return sentence;
};

// Extracts information from a text that matches a Discord emoji pattern
const extractInfo = (text: string): { name: string; number: string; isAnimated: boolean } | null => {
  const match = text.match(/<(a)?:(\w+):(\d+)>/);
  return match ? { name: match[2], number: match[3], isAnimated: !!match[1] } : null;
};

// Function to replace keys in a sentence with provided key-value pairs
const replaceKeysWithValues = (sentence: string, keyValuePairs: { [key: string]: string }): string => {
  for (const key in keyValuePairs) {
    if (sentence.includes(key) && !sentence.includes('\\' + key)) {
      const value = keyValuePairs[key];
      sentence = sentence.replaceAll(key, value);
    }
  }
  return sentence;
};

// Function to support Discord emojis in text, replacing them with markdown image syntax
const DiscEmojiSupport = (text: string): string => {
  if (typeof text !== 'string') {
    return '';
  }

  const regex = /\\?<(a)?:(\w+):(\d+)>/gi; // Match optional backslash

  return text.replace(regex, (match) => {
    if (match.startsWith('\\')) {
      return match.substring(1); // Return the emoji as plain text (remove backslash)
    } else {
      const info = extractInfo(match);

      if (info) {
        const url = `https://cdn.discordapp.com/emojis/${info.number}.${info.isAnimated ? 'gif' : 'png'}?size=16&quality=lossless`;
        return `![${info.name}](${url})`;
      } else {
        return match; // Return the original match if no info is found
      }
    }
  });
};

// Type for a reply object extracted from a post
type Reply = {
  id: string;
  postContent: string;
  replyText: string;
};

// Extracts reply information from a post string
const getReplies = (post: string): Reply | null => {
  const regex = /^(@[a-z_0-9-]+(?: "[^\n]*" \(([a-f0-9\-]+)\)| \[([a-f0-9\-]+)\])(?:\n| )?)(.*)$/is;
  const match = post.match(regex);

  if (!match) {
    return null;
  }

  const postContent = match[4];
  const id = match[2] || match[3];

  if (!postContent || !id) {
    throw new Error("Post content or ID is not defined");
  }

  const replyText = match[1];

  if (!replyText) {
    throw new Error("Reply text is not defined");
  }

  return {
    id,
    postContent,
    replyText,
  };
};

// Function to revise a post by applying various transformations
function revisePost(text: any): string {
  let revisedString = text;

  const wholeReply = getReplies(revisedString)?.replyText;
  revisedString = revisedString.replace(wholeReply, "");
  revisedString = DiscEmojiSupport(revisedString);
  revisedString = EmojiImage(revisedString);

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
  extractInfo
};
