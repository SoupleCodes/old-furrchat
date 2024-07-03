import EmojiImage from './components/post';
import DiscEmojiSupport from './components/post';
import emojiData from './data.tsx';

describe('EmojiImage', () => {
  it('should replace emoji codes with markdown image syntax', () => {
    const text = 'This is a test :smile:';
    const expected = 'This is a test ![smile](path/to/smile.png)';
    const result = EmojiImage(text);
    expect(result).toEqual(expected);
  });

  it('should not replace unknown emoji codes', () => {
    const text = 'This is a test :unknown_emoji:';
    const expected = 'This is a test :unknown_emoji:';
    const result = EmojiImage(text);
    expect(result).toEqual(expected);
  });
});

describe('DiscEmojiSupport', () => {
  it('should replace Discord emoji codes with image URLs', () => {
    const text = '<:smile:1234567890>';
    const expected = '![smile](https://cdn.discordapp.com/emojis/1234567890.png?size=16&quality=lossless)';
    const result = DiscEmojiSupport(text);
    expect(result).toEqual(expected);
  });

  it('should replace animated Discord emoji codes with animated image URLs', () => {
    const text = '<a:smile:1234567890>';
    const expected = '![smile](https://cdn.discordapp.com/emojis/1234567890.gif?size=16&quality=lossless)';
    const result = DiscEmojiSupport(text);
    expect(result).toEqual(expected);
  });

  it('should not replace unknown Discord emoji codes', () => {
    const text = '<:unknown_emoji:1234567890>';
    const expected = '<:unknown_emoji:1234567890>';
    const result = DiscEmojiSupport(text);
    expect(result).toEqual(expected);
  });
});
