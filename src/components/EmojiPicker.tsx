import { memo, useState } from 'react';
import { emojiData, discordEmojis, emoticons, GIFS } from '../lib/Data';
import '/src/styles/EmojiPicker.css'

// Interface for the props of EmojiPicker component
interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void; // Function to handle the selection of an emoji
}

const EmojiPicker = ({ onEmojiSelect }: EmojiPickerProps) => {
  const [isOpen, setIsOpen] = useState(false); // State to manage visibility of the emoji picker
  const [searchQuery, setSearchQuery] = useState(''); // State to manage the search input
  const [selectedCategory, setSelectedCategory] = useState('Smilies'); // State to manage the selected category

  // Convert data objects into arrays of [key, value] pairs
  const emojiDataArray = Object.entries(emojiData);
  const discordEmojisArray = Object.entries(discordEmojis);
  const gifsArray = Object.entries(GIFS);
  const emoticonsArray = emoticons.map((emoticon: any) => [emoticon, emoticon]); // Emoticons don't have image URLs

  // Toggles the visibility of the emoji picker
  const togglePicker = () => {
    setIsOpen(prevIsOpen => !prevIsOpen);
  };

  // Handle the selection of an emoji
  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
  };

  // Handle the change in the search input
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Categories mapping to their corresponding data arrays
  const categories: { [category: string]: any[] } = {
    "GIFS": gifsArray, 
    'Smilies': emojiDataArray,
    'Discord': discordEmojisArray,
    'Emoticons': emoticonsArray, 
  };

  // Handles the category selection and clear search query
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery(''); // Clear search when switching categories
  };
  
  return (
    <>
      <div className="markdown-button" onClick={togglePicker}>
        <img
          src="/furrchat/assets/markdown/Emoji.png"
          alt="Smilies"
          className="emoji-icon"
          height="48"
          title="Emojis"
        />
      </div>
      
      {isOpen && (
        <div className="emoji-container">
          {/* Emoji category buttons */}
          <div className="emoji-categories">
            {Object.keys(categories).map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={selectedCategory === category ? "active" : ""}
                style={{
                  padding: "9.3px",
                  margin: 0,
                  borderBottomLeftRadius: "0px",
                  borderBottomRightRadius: "0px",
                  boxShadow: "inset 0 0 5px rgba(0, 0, 0, 0.3)",
                  background: selectedCategory === category ? "rgba(236, 236, 236)" : "rgba(255, 255, 255)",
                  border: "none",
                }}
              >
                {category}
              </button>
            ))}
          </div>
  
          {/* Emoji grid */}
          <div
            className="emoji-grid"
            key={selectedCategory}
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
                : { padding: "10px" }
            }
          >
            {Array.from(new Set(categories[selectedCategory]))
              .filter(([key]: [string, string]) =>
                key.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(([key, emoji]: [string, string]) => (
                <span
                  key={emoji}
                  onClick={() =>
                    handleEmojiClick(
                      selectedCategory !== "GIFS"
                        ? key
                        : `![${key}](${emoji})`
                    )
                  }
                  className={
                    selectedCategory === "Emoticons"
                      ? "emoticon-item"
                      : "emoji-item"
                  }
                  style={
                    selectedCategory !== "GIFS"
                      ? { height: "24px" }
                      : { height: "64px" }
                  }
                >
                  {emoji ? (
                    selectedCategory === "Discord" ? (
                      // Handle potential errors in Discord emoji format
                      emoji.split(":").length >= 3 ? (
                        <img
                          src={`https://cdn.discordapp.com/emojis/${emoji.split(":")[2].slice(0, -1)}.${
                            emoji.startsWith("<a:") ? "gif" : "webp"
                          }?size=128&quality=lossless`}
                          alt={key}
                          title={key}
                        />
                      ) : (
                        <span>Invalid Discord emoji format</span>
                      )
                    ) : selectedCategory === "Emoticons" ? (
                      <>{key}</>
                    ) : (
                      <img src={emoji} alt={key} title={key} />
                    )
                  ) : null}
                </span>
              ))}
          </div>
  
          {/* Search bar for filtering emojis */}
          
          <div className="emoji-searchbar">
          <input
            type="text"
            id="search-bar"
            placeholder="Search emojis..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          </div>
        </div>
      )}
    </>
  );
  
  
}

export default memo(EmojiPicker);
