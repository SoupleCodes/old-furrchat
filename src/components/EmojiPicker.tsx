import { useState, useRef, useEffect } from "react";
import { discordEmojis, realEmojis } from "../lib/Data";
import "../styles/EmojiPicker.css";
import { usePostContext } from "../Context";
import { uploadToEmoji } from "../lib/api/UploadToEmoji";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  src: string;
  className?: string;
  text?: string;
}

type Category =
  | "Discord"
  | '✨'
  | "🍔"
  | "😀"
  | "🌳"
  | "⚽️"
  | "✈️"
  | "🎁"
  | "⚛️"
  | "🚩";

const EmojiPicker = ({ onEmojiSelect, src, className, text }: EmojiPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("😀");
  const [customEmojis, setCustomEmojis] = useState<{ [key: string]: string }>({});

  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const { userData } = usePostContext();
  const USER_TOKEN = userData?.token;

  useEffect(() => {
    const fetchEmojis = () => {
      const emojis: { [key: string]: string } = {};
      userData?.chats.forEach((chat: any) => {
        if (Array.isArray(chat.emojis)) {
          chat.emojis.forEach((emoji: any) => {
            const emojiURL = `https://uploads.meower.org/emojis/${emoji._id}`;
            emojis[emojiURL] = `<:${emoji._id}>`;
          });
        }
      });
      setCustomEmojis(emojis);
    };
  
    fetchEmojis();
  }, [userData?.chats]);

  const categories: Record<Category, [string, string][]> = {
    '😀': Object.entries(realEmojis.People),
    '🌳': Object.entries(realEmojis.Nature),
    '🍔': Object.entries(realEmojis.Food),
    '⚽️': Object.entries(realEmojis.Activities),
    '✈️': Object.entries(realEmojis.Travel),
    '🎁': Object.entries(realEmojis.Objects),
    '⚛️': Object.entries(realEmojis.Symbols),
    '🚩': Object.entries(realEmojis.Flags),
    Discord: Object.entries(discordEmojis),
    '✨': Object.entries(customEmojis),
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

  const filterAndSortEmojis = (entries: [string, string][]) =>
    entries
      .filter(([key]) => key.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(([key, value], index) => {
        return (
          <span
            key={index}
            onClick={() => handleEmojiClick(value)}
            className="emoji-item"
            style={{ height: "20px" }}
          >
            {selectedCategory === "Discord" ? (
              <img
                src={`https://cdn.discordapp.com/emojis/${value.split(":")[2].slice(0, -1)}.${value.startsWith("<a:") ? "gif" : "webp"}?size=128&quality=lossless`}
                alt={key}
                title={key}
                height="20px"
              />
            ) : selectedCategory === "✨" ? (
              <img src={key} alt={value} height="24px" style={{ cursor: "pointer" }} />
            ) : (
              <span>{value}</span>
            )}
          </span>
        );
      });

  return (
    <div className="emoji-picker-container">
      {text ? (
        <div onClick={() => setIsOpen(prev => !prev)} style={{ display: 'inline-block', cursor: 'pointer', padding: '0.3em 0.6em' }}>
          <img src={src} height={9} alt="Emojis" className={className} title="Emojis" />
          {text}
        </div>
      ) : (
        <img src={src} alt="Emojis" className={className} title="Emojis" onClick={() => setIsOpen(prev => !prev)} />
      )}
      {isOpen && (
        <div className="emoji-picker" ref={emojiPickerRef} style={{ fontSize: "12.7px" }}>
          <div className="emoji-categories">
            {Object.keys(categories).map(category => (
              <button
                key={category}
                style={{
                  background: selectedCategory === category ? "linear-gradient(to bottom, rgb(230, 230, 230) 0%, rgb(205, 205, 205) 100%)" : "linear-gradient(to bottom, rgb(255, 255, 255) 0%, rgb(230, 230, 230) 100%)",
                  border: "none",
                  color: selectedCategory === category ? "white" : "black",
                  fontSize: "12px",
                  width: '100%'
                }}
                onClick={() => handleCategoryClick(category as Category)}
              >
                {category === "Discord" ? (
                  <img src="/furrchat/assets/discord-mark-blue.png" alt="Discord" height="10px" />
                ) : (
                  category
                )}
              </button>
            ))}
          </div>

          <div className="emojis">
            <div className="emoji-list">
              {filterAndSortEmojis(categories[selectedCategory])}
            </div>
          </div>

          <span style={{ display: "flex" }}>
            <input
              id="emoji-search"
              type="text"
              placeholder="Search emojis..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {selectedCategory === "✨" && (
              <span className="search-input-container">
                <button
                  id="file-upload-as-emoji"
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  <img src="/furrchat/assets/icons/emoji_upload.png" height="24px" alt="Upload Emoji" />
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