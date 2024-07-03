import emojiData from './data'

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

  const extractInfo = (text: string): { name: string; number: string; isAnimated: boolean } | null => {
    const match = text.match(/<(a)?:(\w+):(\d+)>/);
    return match ? { name: match[2], number: match[3], isAnimated: !!match[1] } : null;
  };


  export default EmojiImage; DiscEmojiSupport;