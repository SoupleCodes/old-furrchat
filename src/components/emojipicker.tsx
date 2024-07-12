// src/components/EmojiPicker.tsx
import { memo, useState } from 'react';
import { emojiData } from './data';
import { discordEmojis } from './data';
import { emoticons } from './data'
import { GIFS } from './data'


const EmojiPicker = ({ onEmojiSelect }: { onEmojiSelect: (emoji:string) => void}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Smilies')

  const togglePicker = () => {
    setIsOpen(!isOpen);
  };

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const emojiDataArray = Object.entries(emojiData);
  const discordEmojisArray = Object.entries(discordEmojis);
  const emoticonsArray = emoticons.map((emoticon: any) => [emoticon, emoticon]); // Emoticons don't have image URLs
  const gifsArray = Object.entries(GIFS);

  const categories: { [category: string]: any[] } = {
    "GIFS": gifsArray, 
    'Smilies': emojiDataArray,
    'Discord': discordEmojisArray,
    'Emoticons': emoticonsArray, 
  };


  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery(''); // Clear search when switching categories
  }

  return (
    <div className="emoji-container">
     <div className="markdown-button" onClick={togglePicker}>
          <img src="/furrchat/assets/markdown/Emoji.png" alt="Smilies" className="emoji-icon" height="48" title="Emojis"/>
        </div>

{isOpen && (
  <div>
    <input
      type="text"
      id="search-bar"
      placeholder="Search emojis..."
      value={searchQuery}
      onChange={handleSearchChange}
    />
  

  <div className="emoji-categories" style={{display: 'flex', position: 'fixed', top: '342px'}}>

{Object.keys(categories).map((category) => ( 

  <button
    key={category}
    onClick={() => handleCategoryClick(category)} 
    className={selectedCategory === category ? 'active' : ''}
    style={{boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.3)', padding: '7.5px', margin: 0}} 
  >
    {category}
  </button>
))}
</div>


          <div 
         className="emoji-grid" 
         key={selectedCategory} // Key changes when category changes, forcing re-render
         style={ selectedCategory !== 'Emoticons' ? {
             display: 'grid',
             gridTemplateColumns: selectedCategory !== 'GIFS' ? 'repeat(auto-fit, minmax(30px, 1fr))' : 'repeat(auto-fit, minmax(60px, 1fr))',
             gap: '5px' 
         } : {padding: '10px'}}
         >
         
         {Array.from(new Set(categories[selectedCategory]))
              .filter(([key]: [string, string]) => key.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(([key, emoji]: [string, string]) => (
                <span 
                  key={key} 
                  onClick={() => handleEmojiClick(selectedCategory !== 'GIFS' ? key : `![${key}](${emoji})`)} 
                  className={ selectedCategory === 'Emoticons' ? 'emoticon-item' : "emoji-item"}
                  style={ selectedCategory !== 'GIFS' ? {height: '24px'} : {height: '64px'}}
                >
                  {emoji ? (
                    selectedCategory === 'Discord' ? (
                      // Handle potential errors in Discord emoji format
                      emoji.split(':').length >= 3 ? (
                        <img 
                          src={`https://cdn.discordapp.com/emojis/${emoji.split(':')[2].slice(0,-1)}.${emoji.startsWith('<a:') ? 'gif' : 'webp'}?size=128&quality=lossless`} 
                          alt={key} 
                          title={key} 
                        />
                      ) : (
                        <span>Invalid Discord emoji format</span>
                      )
                    ) : selectedCategory === 'Emoticons' ? (
                      <>{key}</> 
                    ) : (

                      <img src={emoji} alt={key} title={key} /> 
                    )
                  ) : null}
                </span>
              ))}
          </div> 
        </div> // End of the isOpen conditional div
      )} 

    </div> // End of emoji-container div
  );
}

export default memo(EmojiPicker);
