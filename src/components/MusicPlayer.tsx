import { usePostContext } from '../Context';
import { musicLibrary } from '../lib/Data';
import "../styles/Settings.css";

const MusicPlayer = () => {
  const { isBgmEnabled, selectedTrackIndex, toggleBgm, selectTrack } = usePostContext();

  return (
    <div style={{ width: '100%', padding: 0 }}>
      <label>
        Enable BGM:
        <input
          type="checkbox"
          checked={isBgmEnabled}
          onChange={(e) => toggleBgm(e.target.checked)}
        />
      </label>
      {isBgmEnabled && (
        <details>
          <summary>
          <label>Select Music:</label>
          </summary>
          <div>
            {musicLibrary.map((track, index) => (
              <div
                key={index}
                onClick={() => selectTrack(index)}
                style={{
                  cursor: 'pointer',
                  color: selectedTrackIndex === index ? 'grey' : 'black',
                  background: selectedTrackIndex === index
                    ? 'linear-gradient(to bottom,rgba(255, 255, 255, 0.507) 0%, rgba(230, 230, 230, 0.5) 100%)'
                    : 'transparent',
                  fontWeight: selectedTrackIndex === index ? '600' : 'normal',
                  border: selectedTrackIndex === index ? '1px solid grey' : 'none',
                  boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.2), -5px -5px 10px rgba(255, 255, 255, 0.3), 0 3px 1px rgba(0, 0, 0, 0.2), 0 2px 0 0 rgba(255, 255, 255, 0.7) inset',
                  padding: '5px',
                  marginBottom: '5px',
                  backgroundColor: selectedTrackIndex === index ? '#f0f0f0' : 'transparent',
                  borderRadius: '5px',
                  boxSizing: 'border-box',
                  width: '100%'
                }}
              >
                {track.songName} by {track.author}
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
};

export default MusicPlayer;