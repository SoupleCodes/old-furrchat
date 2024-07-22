import { useState, useRef } from "react";
import {
  emojiData,
  discordEmojis,
  emoticons,
  GIFS,
  PBJTime,
} from "../lib/Data";
import "../styles/EmojiPicker.css";

// Interface for the props of EmojiPicker component
interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void; // Function to handle the selection of an emoji
}

const EmojiPicker = ({ onEmojiSelect }: EmojiPickerProps) => {
  const [isOpen, setIsOpen] = useState(false); // State to manage visibility of the emoji picker
  const [searchQuery, setSearchQuery] = useState(""); // State to manage the search input
  const [selectedCategory, setSelectedCategory] = useState("Smilies"); // State to manage the selected category

  const emojiPickerRef = useRef<HTMLDivElement>(null); // Ref to store reference to emoji picker

  // Convert data objects into arrays of [key, value] pairs
  const emojiDataArray = Object.entries(emojiData);
  const discordEmojisArray = Object.entries(discordEmojis);
  const gifsArray = Object.entries(GIFS);
  const pbjArray = Object.entries(PBJTime);
  const emoticonsArray = emoticons.map((emoticon: string) => [
    emoticon,
    emoticon,
  ]);

  // Categories mapping to their corresponding data arrays
  const categories: { [category: string]: any[] } = {
    Smilies: emojiDataArray,
    Emoticons: emoticonsArray,
    "PBJ Time!": pbjArray,
    Discord: discordEmojisArray,
    GIFS: gifsArray,
  };

  // Toggles the visibility of the emoji picker
  const togglePicker = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  // Handle the selection of an emoji
  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    setIsOpen(false); // Close picker after selection
  };

  // Handle the change in the search input
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Handles the category selection and clears search query
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery("");
  };

  // Rendering emojis based on selected category and filtered by search query
  const emojiList = categories[selectedCategory]
    .filter(([key]) => key.toLowerCase().includes(searchQuery.toLowerCase()))
    .map(([key, value]) => (
      <span
        key={Math.random()}
        onClick={() =>
          handleEmojiClick(
            selectedCategory === "GIFS"
              ? `![${key}](${value})`
              : selectedCategory === "Emoticons"
              ? key
              : key
          )
        }
        className={
          selectedCategory === "Emoticons" ? "emoticon-item" : "emoji-item"
        }
        style={{
          height: selectedCategory === "GIFS" ? "64px" : "24px",
        }}
      >
        {selectedCategory === "Discord" ? (
          // Handle potential errors in Discord emoji format
          value.split(":").length >= 3 ? (
            <img
              src={`https://cdn.discordapp.com/emojis/${value
                .split(":")[2]
                .slice(0, -1)}.${
                value.startsWith("<a:") ? "gif" : "webp"
              }?size=128&quality=lossless`}
              alt={key}
              title={key}
            />
          ) : (
            <span>Invalid Discord emoji format</span>
          )
        ) : selectedCategory === "Emoticons" ? (
          // Handle emoticons
          <>{key}</>
        ) : (
          // Handle regular emojis or GIFS
          <img src={value} alt={key} title={key} />
        )}
      </span>
    ));

  return (
    <div className="emoji-picker-container">
      <div className="markdown-button" onClick={togglePicker}>
        <img
          src="/furrchat/assets/markdown/Emoji.png"
          alt="Smilies"
          className="emoji-icon"
          height="48"
          title="Emojis"
        />
      </div>
      <div
        className="emoji-picker"
        style={{ position: "fixed", zIndex: "20000" }}
      >
        {isOpen && (
          <div className="emoji-picker" ref={emojiPickerRef}>
            <div className="emoji-categories">
              {Object.keys(categories).map((category) => (
                <button
                  key={category}
                  style={{
                    padding: "9.3px",
                    margin: 0,
                    borderBottomLeftRadius: "0px",
                    borderBottomRightRadius: "0px",
                    boxShadow:
                      "5px 5px 10px rgba(0, 0, 0, 0.5), -5px -5px 10px rgba(255, 255, 255, 0.3), 0 2px 0 0 rgba(255, 255, 255, 0.7) inset",
                    background:
                      selectedCategory === category
                        ? "linear-gradient(to bottom, rgb(230, 230, 230) 0%, rgb(205, 205, 205) 100%)"
                        : "linear-gradient(to bottom, rgb(255, 255, 255) 0%, rgb(230, 230, 230) 100%)",
                    border: "none",
                  }}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <div
              className="emoji-list"
              style={
                selectedCategory !== "Emoticons"
                  ? {
                      display: "grid",
                      gridTemplateColumns:
                        selectedCategory !== "GIFS"
                          ? "repeat(auto-fit, minmax(30px, 1fr))"
                          : "repeat(auto-fit, minmax(60px, 1fr))",
                      gap: "5px",
                    }
                  : { padding: "10px", maxWidth: "353px" }
              }
            >
              {emojiList}
            </div>
            <div className="search-input-container">
              <input
                type="text"
                placeholder="Search emojis..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmojiPicker;