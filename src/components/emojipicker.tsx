// src/components/EmojiPicker.tsx
import { useState } from 'react';
import { emojiData } from './data';

const EmojiPicker = ({ onEmojiSelect }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const togglePicker = () => {
    setIsOpen(!isOpen);
  };

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className="emoji-container">
      <button onClick={togglePicker} type="button" style={{ whiteSpace: 'nowrap', height: '90px' }}>
        {'☺'}
      </button>
      {isOpen && (
        <div>
          <input 
            type="text" 
            id="search-bar"
            placeholder="Search emojis..." 
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className="emoji-grid"> 
            {Object.entries(emojiData)
              .filter(([, emoji], index, self) => 
                index === self.findIndex(([, e]) => e === emoji) // Filter out duplicates
              )
              .filter(([key]) => key.toLowerCase().includes(searchQuery.toLowerCase())) // Filter by search
              .map(([key, emoji]) => (
                <span key={key} onClick={() => handleEmojiClick(key)} className="emoji-item">
                  {emoji ? ( 
                    <img src={emoji} alt={key} title={key} /> 
                  ) : (
                    <span>Emoji not found</span> 
                  )}
                </span>
              ))
              
            }
          </div>
        </div>
      )}
    </div>
  );
}

export default EmojiPicker;
