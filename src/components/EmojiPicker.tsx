import { useState, useRef, useEffect } from "react";
import {
  emojiData,
  discordEmojis,
  emoticons,
  GIFS,
  PBJTime,
  CATS,
} from "../lib/Data";
import "../styles/EmojiPicker.css";
import { usePostContext } from "../Context";
import { uploadToEmoji } from "../lib/api/UploadToEmoji";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  src: string;
}
const storedData = localStorage.getItem("userEmojis");
const parsedData = storedData ? JSON.parse(storedData) : {};

const EmojiPicker = ({ onEmojiSelect, src }: EmojiPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Smilies");
  const [customEmojis, setCustomEmojis] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    setCustomEmojis(parsedData);
  }, []);

  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const { userData } = usePostContext();
  const USER_TOKEN: any = userData?.token;

  // Convert data objects into arrays of [key, value] pairs
  const emojiDataArray = Object.entries(emojiData);
  const discordEmojisArray = Object.entries(discordEmojis);
  const gifsArray = Object.entries(GIFS);
  const pbjArray = Object.entries(PBJTime);
  const catArray = Object.entries(CATS);
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
    Cats: catArray,
    Custom: Object.entries(customEmojis),
  };

  const togglePicker = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };
  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  function handleButtonClick() {
    const fileInput = document.getElementById(
      "file-input"
    ) as HTMLInputElement | null;

    if (fileInput) {
      fileInput.click();
    } else {
      console.error("File input element not found.");
    }
  }

  // Function to handle file upload
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      try {
        const response = await uploadToEmoji({ file, userToken: USER_TOKEN });
        const newEmoji = `https://uploads.meower.org/emojis/${response}`;
        setCustomEmojis((prevEmojis) => ({
          ...prevEmojis,
          [`<:${response}>`]: newEmoji,
        }));
        localStorage.setItem(
          "userEmojis",
          JSON.stringify({ ...customEmojis, [`<:${response}>`]: newEmoji })
        );
      } catch (error) {
        console.error("Failed to upload emoji:", error);
      }
    }
  };

  const removeCustomEmoji = (key: string) => {
    setCustomEmojis((prevEmojis) => {
      const updatedEmojis = { ...prevEmojis };
      delete updatedEmojis[key];
      localStorage.setItem("userEmojis", JSON.stringify(updatedEmojis));
      return updatedEmojis;
    });
  };

  // Rendering emojis based on selected category and filtered by search query
  const emojiList = categories[selectedCategory]
    .filter(([key]) => key.toLowerCase().includes(searchQuery.toLowerCase()))
    .reduce((acc, [key, value]) => {
      const found = acc.find(
        (item: { key: any; value: any }) => item.value === value
      );
      if (!found) {
        acc.push({ key, value });
      }
      return acc;
    }, [])
    .sort((a: { key: string }, b: { key: any }) => a.key.localeCompare(b.key))
    .map(({ key, value }: any) => (
      <span
        key={key}
        onClick={() =>
          handleEmojiClick(
            selectedCategory === "GIFS"
              ? `![${key}](${value})`
              : selectedCategory === "Emoticons"
              ? key
              : selectedCategory === "Discord"
              ? value
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
        ) : selectedCategory === "Custom" ? (
          <div style={{ position: "relative", display: "inline-block" }}>
            <img src={value} alt={key} title={key} width={75} />
            <button
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                padding: "2px",
                borderRadius: "5px",
                backgroundColor: "rgba(255,255,255)",
                color: "black",
                border: "none",
                cursor: "pointer",
                lineHeight: 0.6,
              }}
              onClick={() => removeCustomEmoji(key)} // Remove emoji on click
            >
              x
            </button>
          </div>
        ) : (
          // Handle regular emojis or GIFS
          <>
            <img src={value} alt={key} title={key} />
          </>
        )}
      </span>
    ));

  return (
    <div className="emoji-picker-container">
      <div className="markdown-button" onClick={togglePicker}>
        <img
          src={src}
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

            <span className="search-input-container">
              <input
                id="emoji-search"
                type="text"
                placeholder="Search emojis..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              {selectedCategory === "Custom" && (
                <>
                  <button id="file-upload-as-emoji" onClick={handleButtonClick}>
                    <img
                      src={"/furrchat/assets/icons/emoji_upload.png"}
                      height="32px"
                      alt="Upload Emoji"
                    />
                  </button>
                  <input
                    id="file-input"
                    type="file"
                    accept=".webp, .png, .jpeg, .gif"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                </>
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmojiPicker;
