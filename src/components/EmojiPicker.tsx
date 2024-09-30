import { useState, useRef, useEffect } from "react";
import { emojiData, discordEmojis, emoticons, GIFS, PBJTime } from "../lib/Data";
import "../styles/EmojiPicker.css";
import { usePostContext } from "../Context";
import { uploadToEmoji } from "../lib/api/UploadToEmoji";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  src: string;
  chatID?: string;
}

type Category =
  | "Smilies"
  | "Emoticons"
  | "PBJ"
  | "Discord"
  | "GIFS"
  | "Custom";

const EmojiPicker = ({ onEmojiSelect, src, chatID }: EmojiPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("Smilies");
  const [customEmojis, setCustomEmojis] = useState<{ [key: string]: string }>(
    JSON.parse(localStorage.getItem("userEmojis") || "{}")
  );

  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const { userData } = usePostContext();
  const USER_TOKEN = userData?.token;

  useEffect(() => {
    const fetchEmojis = async () => {
      if (chatID && USER_TOKEN) {
        try {
          const response = await fetch(`https://api.meower.org/chats/${chatID}`, {
            headers: { Token: USER_TOKEN },
          });
          if (response.ok) {
            const data = await response.json();
            if (!data.error && data.emojis) {
              const newCustomEmojis = data.emojis.reduce((acc: { [key: string]: string }, emoji: any) => {
                const emojiURL = `https://uploads.meower.org/emojis/${emoji._id}`;
                acc[`<:${emoji._id}>`] = emojiURL;
                return acc;
              }, {});
              setCustomEmojis(prev => ({ ...prev, ...newCustomEmojis }));
            }
          }
        } catch (error) {
          console.error("Error fetching emojis:", error);
        }
      }
    };

    fetchEmojis();
  }, [chatID, USER_TOKEN]);

  const categories: Record<Category, [string, string][]> = {
    Smilies: Object.entries(emojiData),
    Emoticons: emoticons.map(e => [e, e]),
    "PBJ": Object.entries(PBJTime),
    Discord: Object.entries(discordEmojis),
    GIFS: Object.entries(GIFS),
    Custom: Object.entries(customEmojis),
  };

  const handleEmojiClick = (emoji: string) => onEmojiSelect(emoji);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value);
  const handleCategoryClick = (category: Category) => setSelectedCategory(category);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && USER_TOKEN) {
      for (const file of e.target.files) {
        try {
          const response = await uploadToEmoji({ file, userToken: USER_TOKEN });
          const newEmojiURL = `https://uploads.meower.org/emojis/${response}`;
          const updatedEmojis = { ...customEmojis, [`<:${response}>`]: newEmojiURL };
          setCustomEmojis(updatedEmojis);
          localStorage.setItem("userEmojis", JSON.stringify(updatedEmojis));
        } catch (error) {
          console.error("Failed to upload emoji:", error);
        }
      }
    }
  };

  const removeCustomEmoji = (key: string) => {
    const updatedEmojis = { ...customEmojis };
    delete updatedEmojis[key];
    setCustomEmojis(updatedEmojis);
    localStorage.setItem("userEmojis", JSON.stringify(updatedEmojis));
  };

const filterAndSortEmojis = (entries: [string, string][]) =>
  entries
    .filter(([key]) => key.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value], index) => {
      const isEmoticon = selectedCategory === "Emoticons";
      return ( 
        <span
          key={index}
          onClick={() => handleEmojiClick(
            selectedCategory === "GIFS"
              ? `![${key}](${value})`
              : isEmoticon
              ? key
              : selectedCategory === "Discord"
              ? value
              : key
          )}
          className={isEmoticon ? "emoticon-item" : "emoji-item"} 
          style={{ height: selectedCategory === "GIFS" ? "64px" : "24px" }}
        >
          {selectedCategory === "Discord" ? (
            <img
              src={`https://cdn.discordapp.com/emojis/${value.split(":")[2].slice(0, -1)}.${value.startsWith("<a:") ? "gif" : "webp"}?size=128&quality=lossless`}
              alt={key}
              title={key}
              key={key}
            />
          ) : selectedCategory === "Emoticons" ? (
            <button key={key}>{key}</button>
          ) : selectedCategory === "Custom" ? (
            <div>
              <img
                src={value}
                alt={key}
                title={'Right click to delete'}
                height={24}
                onContextMenu={(e) => {
                  e.preventDefault();
                  removeCustomEmoji(key);
                }}
                style={{ cursor: "pointer" }}
                key={key}
              />
            </div>
          ) : (
            <img src={value} alt={key} title={key} />
          )}
        </span>
      )});

  return (
    <div className="emoji-picker-container">
        <img src={src} alt="Emojis" className="markdown-item" title="Emojis" onClick={() => setIsOpen(prev => !prev)}/>
      {isOpen && (
        <div className="emoji-picker" ref={emojiPickerRef}>
          <div className="emoji-categories">
            {Object.keys(categories).map(category => (
              <button
                key={category}
                style={{
                  background: selectedCategory === category
                    ? "linear-gradient(to bottom, rgb(230, 230, 230) 0%, rgb(205, 205, 205) 100%)"
                    : "linear-gradient(to bottom, rgb(255, 255, 255) 0%, rgb(230, 230, 230) 100%)",
                  border: "none",
                }}
                onClick={() => handleCategoryClick(category as Category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="emoji-list" style={{
            display: selectedCategory === "Emoticons" ? "block" : "grid",
            gridTemplateColumns: selectedCategory === "GIFS" ? "repeat(auto-fit, minmax(60px, 1fr))" : "repeat(auto-fit, minmax(30px, 1fr))",
            gap: "5px",
            padding: selectedCategory === "Emoticons" ? "10px" : 0,
          }}>
            {filterAndSortEmojis(categories[selectedCategory])}
          </div>
          <span style={{ display: "flex" }}>
          <input
                id="emoji-search"
                type="text"
                placeholder="Search emojis..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
          {selectedCategory === "Custom" && (
            <span className="search-input-container">
              <button
                id="file-upload-as-emoji"
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <img
                  src="/furrchat/assets/icons/emoji_upload.png"
                  height="24px"
                  alt="Upload Emoji"
                />
              </button>
              <input
                id="file-input"
                type="file"
                accept=".webp, .png, .jpeg, .gif"
                multiple
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
            </span>
          )}
          </span>
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;