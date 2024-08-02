import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UserAccount {
  _id: string;
  active_dms: string[];
  avatar: string;
  avatar_color: string;
  ban: {}
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
  userData: UserData | null; // Use UserData type and allow null
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>; // Use UserData type and allow null
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
  const [userData, setUserData] = useState<UserData | null>(null); // Initialize with null

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
    setUserData
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};