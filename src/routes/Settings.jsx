import { useState, useMemo, useEffect } from "react";
import { usePostContext } from "../Context.tsx";
import { defaultPFPS } from "../lib/Data.ts";
import ReactMarkdown from "react-markdown";
import "../styles/Settings.css";
import { uploadIconAndGetId } from "../lib/api/UploadIconAndGetId.ts";

export default function Settings() {
  const { userData, setUserData } = usePostContext();
  if (localStorage.getItem("userData")) {

  const userToken = userData?.token;

  const parsedData = JSON.parse(localStorage.getItem("userData") || "{}");
  const initialAvatarColor = parsedData.account?.avatar_color || "!color";

  const { pfp } = useMemo(() => {
    const pfpUrl = parsedData.account?.avatar
      ? `https://uploads.meower.org/icons/${parsedData.account.avatar}`
      : parsedData.account._id === "Server"
      ? `https://app.meower.org/assets/icon_100-026e1a7d.svg`
      : defaultPFPS[parsedData.account?.pfp_data || 0];
    return { pfp: pfpUrl };
  }, [parsedData]);

  const [bio, setBio] = useState(parsedData.account?.quote || "");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedColorOption, setSelectedColorOption] = useState(
    initialAvatarColor === "!color" ? "none" : "pickedAvatarColor"
  );
  const [avatarColor, setAvatarColor] = useState(`#${initialAvatarColor}`);
  const [profilePictureOptions, setProfilePictureOptions] = useState([
    ...Object.entries(defaultPFPS).map(([key, pfp]) => ({
      key,
      url: pfp,
      title: `Profile Picture ${key}`
    })),
    {
      key: "upload",
      url: "/furrchat/assets/icons/pfp_upload.png",
      title: "Upload Custom PFP"
    }
  ]);
  const [uploading, setUploading] = useState(false);
  const [fileDataMap, setFileDataMap] = useState(new Map());

  useEffect(() => {
    updateConfig("avatar_color", selectedColorOption === "pickedAvatarColor"
      ? avatarColor.substring(1)
      : "!color");
  }, [selectedColorOption, avatarColor]);

  const updateConfig = async (param, newValue) => {
    try {
      const response = await fetch("https://api.meower.org/me/config", {
        method: "PATCH",
        body: JSON.stringify({ [param]: newValue }),
        headers: {
          "Content-Type": "application/json",
          Token: userToken,
        },
      });

      if (response.ok) {
        const data = await response.json();
        await updateLocalStorageConfig(param, newValue);
        setUserData(prev => ({
          ...prev,
          account: { ...prev.account, [param]: data[param] }
        }));
      } else {
        console.error("Failed to update configuration");
      }
    } catch (error) {
      console.error("Error updating configuration:", error);
    }
  };

  const updateLocalStorageConfig = async (param, newValue) => {
    try {
      const storedData = JSON.parse(localStorage.getItem("userData") || "{}");
      localStorage.setItem("userData", JSON.stringify({
        ...storedData,
        account: { ...storedData.account, [param]: newValue }
      }));
    } catch (error) {
      console.error("Error updating local storage configuration:", error);
    }
  };

  const handleBioChange = (event) => setBio(event.target.value);
  const handleBioBlur = () => {
    setIsEditing(false);
    updateConfig("quote", bio);
  };

  const handleColorPickerChange = (event) => {
    const newColor = event.target.value;
    setAvatarColor(newColor);
    if (selectedColorOption === "pickedAvatarColor") {
      updateConfig("avatar_color", newColor.substring(1));
    }
  };

  const handleColorOptionChange = (event) => {
    const newOption = event.target.value;
    setSelectedColorOption(newOption);
    updateConfig(
      "avatar_color",
      newOption === "pickedAvatarColor" ? avatarColor.substring(1) : "!color"
    );
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploading(true);
      try {
        const iconId = await uploadIconAndGetId({ file, userToken });
        const newProfilePicture = {
          rawData: file,
          key: iconId,
          url: `https://uploads.meower.org/icons/${iconId}`,
          title: `Custom PFP: ${iconId}`
        };
        setProfilePictureOptions(prevOptions => [
          ...prevOptions,
          newProfilePicture
        ]);
        setFileDataMap(prevMap => new Map(prevMap).set(iconId, file));
        updateConfig("avatar", iconId);
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Upload failed.');
      } finally {
        setUploading(false);
      }
    } else {
      console.error('No file selected');
      alert('No file selected');
    }
  };  

  const handleButtonClick = () => {
    if (!uploading) document.getElementById('fileInput').click();
  };

  const handlePFPClick = async (key, url) => {
    if (key === "upload") {
      handleButtonClick();
    } else if (url.startsWith('https://uploads.meower.org/icons/')) {
      const file = fileDataMap.get(key);
      if (file) {
        try {
          const iconId = await uploadIconAndGetId({ file, userToken });
          updateConfig("avatar", iconId);
        } catch (error) {
          console.error('Re-upload failed:', error);
          alert('Re-upload failed.');
        }
      } else {
        console.error('File data not found');
        alert('File data not found.');
      }
    } else {
      updateConfig("avatar", "");
      updateConfig("pfp_data", key);
    }
  };

  const handleRemovePFP = (key) => {
    setProfilePictureOptions(prevOptions => prevOptions.filter(pfp => pfp.key !== key));
    setFileDataMap(prevMap => {
      const newMap = new Map(prevMap);
      newMap.delete(key);
      return newMap;
    });
    if (pfp.startsWith('https://uploads.meower.org/icons/') && key === pfp) {
      updateConfig("avatar", "");
    }
  };

  const renderPFPSet = () => (
    <div className="pfpset">
      {profilePictureOptions.map(({ key, url, title }) => (
        <div key={key} className="pfp-item">
          <div className="pfp-container">
            <img
              src={url}
              title={title}
              width="48"
              height="48"
              className="pick-pfp"
              onClick={() => handlePFPClick(key, url)}
            />
            {title.startsWith('Custom PFP:') && (
              <button
                className="remove-pfp"
                onClick={() => handleRemovePFP(key)}
              >
                X
              </button>
            )}
          </div>
        </div>
      ))}
      <input
        id="fileInput"
        type="file"
        accept=".png,.jpg,.jpeg,.svg"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );

  return (
    <div className="settings-container">
      <div className="user-profile">
        <div className="profile-info">
          <div className="post-pfp-container">
            <img
              src={pfp}
              alt={`${parsedData?.account._id}'s profile picture`}
              className="post-pfp"
              width="128"
              height="128"
              style={{
                borderRadius: "5px",
                border: selectedColorOption === "none" ? "none" : `2.5px solid ${avatarColor}`,
                boxShadow: "0px 0px 6px rgba(0, 0, 0, 0.4)"
              }}
            />
          </div>
          <div className="user-text">{parsedData?.account._id}</div>
        </div>
        <div style={{ flexGrow: 1, flexDirection: "column" }}>
          <div className="user-bio-container">
            Your Quote:
            {isEditing ? (
              <textarea
                className="textarea-userbio"
                value={bio}
                onChange={handleBioChange}
                onBlur={handleBioBlur}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleBioBlur()}
              />
            ) : (
              <div className="user-bio" onClick={() => setIsEditing(true)}>
                <ReactMarkdown>{bio}</ReactMarkdown>
              </div>
            )}
          </div>
          <div className="color-picker-container">
            <label htmlFor="pickedAvatarColor">Avatar Color:</label>
            <input
              type="color"
              id="pickedAvatarColor"
              name="pickedAvatarColor"
              value={selectedColorOption === "pickedAvatarColor" ? avatarColor : "!color"}
              onChange={handleColorPickerChange}
              disabled={selectedColorOption === "none"}
            />
            <label>
              <input
                type="radio"
                name="avatarColorOption"
                value="pickedAvatarColor"
                checked={selectedColorOption === "pickedAvatarColor"}
                onChange={handleColorOptionChange}
              />
              Use Color Picker
            </label>
            <label>
              <input
                type="radio"
                name="avatarColorOption"
                value="none"
                checked={selectedColorOption === "none"}
                onChange={handleColorOptionChange}
              />
              None
            </label>
          </div>
        </div>
      </div>
      <div className="user-profile">
        <span style={{ flexGrow: 1, flexDirection: "column" }}>
          Profile Picture:
          {renderPFPSet()}
        </span>
      </div>
    </div>
  );
} else {
  return (
    <div>You're not logged in yet!...</div>
  )
}
}