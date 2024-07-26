import React, { createContext, useContext, useState } from 'react';

type PostContextType = {
  post: string;
  setPost: React.Dispatch<React.SetStateAction<string>>;
  selectionStart: number;
  setSelectionStart: React.Dispatch<React.SetStateAction<number>>;
  selectionEnd: number;
  setSelectionEnd: React.Dispatch<React.SetStateAction<number>>;
  replyIds: string[];
  setReplyIds: React.Dispatch<React.SetStateAction<string[]>>;
};

const PostContext = createContext<PostContextType | undefined>(undefined);

export const usePostContext = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePostContext must be used within a PostProvider');
  }
  return context;
};

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [post, setPost] = useState('');
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const [replyIds, setReplyIds] = useState<string[]>([]);

  const value = {
    post,
    setPost,
    selectionStart,
    setSelectionStart,
    selectionEnd,
    setSelectionEnd,
    replyIds,
    setReplyIds
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
};
