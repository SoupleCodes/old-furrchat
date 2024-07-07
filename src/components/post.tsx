import { emojiData } from './data.tsx'

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
  if (typeof text !== 'string') {
    return ''; // Or handle the non-string case as you see fit
  }

  const regex = /<(a)?:(\w+):(\d+)>/gi;

  return text.replace(regex, function(match) {
    const info = extractInfo(match); // Pass the match to extractInfo

    if (info) {
      const url = `https://cdn.discordapp.com/emojis/${info.number}.${info.isAnimated ? 'gif' : 'png'}?size=16&quality=lossless`;
      return `![${info.name}](${url})`;
    } else {
      return match; // Return the original match if no info is found
    }
  });
};



  export {EmojiImage, DiscEmojiSupport, handleAttachments}