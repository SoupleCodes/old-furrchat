import React, { createContext, useContext, useState, ReactNode, useRef, useEffect } from 'react';
import { musicLibrary } from './lib/Data';

export interface UserAccount {
  _id: string;
  active_dms: string[];
  avatar: string;
  avatar_color: string;
  ban: {};
  banned: boolean;
  bgm: boolean;
  bgm_song: number;
  created: string;
  debug: boolean;
  favorited_chats: [];
  flags: number;
  hide_blocked_users: boolean;
  last_seen: number;
  layout: string;
  lower_username: string;
  lvl: number;
  mode: true;
  permissions: number;
  pfp_data: number;
  quote: string;
  sfx: boolean;
  theme: string;
  unread_inbox: boolean;
  uuid: string;
  relationships: [];
  chats: [];
}

export interface UserData {
  username: any;
  token: string;
  account: UserAccount;
  relationships: any[];
  chats: any[];
}

type PostContextType = {
  post: string;
  setPost: React.Dispatch<React.SetStateAction<string>>;
  selectionStart: number;
  setSelectionStart: React.Dispatch<React.SetStateAction<number>>;
  selectionEnd: number;
  setSelectionEnd: React.Dispatch<React.SetStateAction<number>>;
  replyIds: string[];
  setReplyIds: React.Dispatch<React.SetStateAction<string[]>>;
  loginSuccess: boolean;
  setLoginSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  userToken: string;
  setUserToken: React.Dispatch<React.SetStateAction<string>>;
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  isBgmEnabled: boolean;
  selectedTrackIndex: number | null;
  toggleBgm: (enabled: boolean) => void;
  selectTrack: (index: number) => void;
};

const PostContext = createContext<PostContextType | undefined>(undefined);

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePostContext must be used within a PostProvider');
  }
  return context;
};

export const PostProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [post, setPost] = useState('');
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const [replyIds, setReplyIds] = useState<string[]>([]);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [userToken, setUserToken] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);
  
  // Music state
  const [isBgmEnabled, setIsBgmEnabled] = useState<boolean>(false);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}").account || {};
    setIsBgmEnabled(userData.bgm ?? false);
    setSelectedTrackIndex(userData.bgm_song ? userData.bgm_song - 1 : null);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isBgmEnabled && selectedTrackIndex !== null) {
        const track = musicLibrary[selectedTrackIndex];
        audioRef.current.src = track.path;
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [isBgmEnabled, selectedTrackIndex]);

  const toggleBgm = (enabled: boolean) => {
    setIsBgmEnabled(enabled);
    if (!enabled) {
      setSelectedTrackIndex(null);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
    const updatedUserData = { ...userData?.account, bgm: enabled };
    localStorage.setItem("userData", JSON.stringify({
      ...JSON.parse(localStorage.getItem("userData") || "{}"),
      account: updatedUserData
    }));
  };

  const selectTrack = (index: number) => {
    setSelectedTrackIndex(index);
    const updatedUserData = { ...userData?.account, bgm_song: index + 1 };
    localStorage.setItem("userData", JSON.stringify({
      ...JSON.parse(localStorage.getItem("userData") || "{}"),
      account: updatedUserData
    }));
  };

  const value = {
    post,
    setPost,
    selectionStart,
    setSelectionStart,
    selectionEnd,
    setSelectionEnd,
    replyIds,
    setReplyIds,
    loginSuccess,
    setLoginSuccess,
    userToken,
    setUserToken,
    userData,
    setUserData,
    isBgmEnabled,
    selectedTrackIndex,
    toggleBgm,
    selectTrack
  };

  return (
    <PostContext.Provider value={value}>
      {children}
      <audio ref={audioRef} controls loop style={{ display: 'none' }}></audio>
    </PostContext.Provider>
  );
};