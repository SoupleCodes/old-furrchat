import { emojiData } from './data.tsx'
import { discordEmojis } from './data.tsx'

const handleAttachments = ((attachments: any[]): string => {
  // Loop through attachments and build markdown image elements
  try {
    return (attachments as any)
      .map(
        (attachment: any) =>
          `![](https://uploads.meower.org/attachments/${attachment.id}/${attachment.filename})` as any
      )
      .join(" " as any) as any;
  } catch (error) {
    console.error("Error handling attachments:" as any, error as any);
    return "" as any; // Return an empty string in case of errors
  }
}) as any;


const EmojiImage = (sentence: string): string => {
  let newSentence = sentence;
  for (const key in emojiData) {

    if (sentence.includes(key) && !sentence.includes('\\' + key)) { 
      const value = emojiData[key];
      newSentence = newSentence.replaceAll(key, `![${key}](${value})`);
    }
  }
  return newSentence;
};
  
const extractInfo = (text: string): { name: string; number: string; isAnimated: boolean } | null => {
    const match = text.match(/<(a)?:(\w+):(\d+)>/);
    return match ? { name: match[2], number: match[3], isAnimated: !!match[1] } : null;
};

function replaceKeysWithValues(sentence: string, keyValuePairs: { [key: string]: string }): string {
  let newSentence = sentence;
  for (const key in keyValuePairs) {

    if (newSentence.includes(key) && !newSentence.includes('\\' + key)) { 
      const value = keyValuePairs[key];
      newSentence = newSentence.replaceAll(key, value);
    }
  }
  return newSentence;
}


const DiscEmojiSupport = (text: string): string => {
  if (typeof text !== 'string') {
    return ''; // Or handle the non-string case as you see fit
  }

  const regex = /\\?<(a)?:(\w+):(\d+)>/gi; // Match optional backslash

  return text.replace(regex, function(match) {
    // Check if the match starts with a backslash
    if (match.startsWith('\\')) {
      return match.substring(1); // Return the emoji as plain text (remove backslash)
    } else {
      const info = extractInfo(match); // Pass the match to extractInfo

      if (info) {
        const url = `https://cdn.discordapp.com/emojis/${info.number}.${info.isAnimated ? 'gif' : 'png'}?size=16&quality=lossless`;
        return `![${info.name}](${url})`;
      } else {
        return match; // Return the original match if no info is found
      }
    }
  });
};


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

function revisePost(text: any) {
  let revisedString: any
  revisedString = text
  
    var wholeReply = getReply(revisedString)?.replyText
    revisedString = revisedString.replace(wholeReply, "");
    revisedString = DiscEmojiSupport(revisedString)
    revisedString = EmojiImage(revisedString)
    
    let regex, match
  
    regex = /\[\(sticker\) (.+?): (.+)\]/; 
    match = revisedString.match(regex);
    if (match) {
      const name = match[1];
      const imageLink = match[2]; 
      revisedString = revisedString.replace(regex, `![${name}](${imageLink})`);
    }

    revisedString = replaceKeysWithValues(revisedString, discordEmojis);
    {/* const urlRegex = /(https?:\/\/[^\s]+?\.(?:png|jpg|jpeg|gif|webp))/g;
  revisedString = revisedString.replace(urlRegex, `![]($1)`); */}
  revisedString = revisedString.replace(/\n/g, "\n\n")

  return revisedString;
}

  export {EmojiImage, DiscEmojiSupport, handleAttachments, getReply, revisePost, extractInfo}