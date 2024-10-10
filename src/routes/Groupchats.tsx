import React, { useState, useEffect, useCallback } from 'react';
import { usePostContext } from "../Context";
import styles from '../styles/Groupchats.module.css';
import { getChatbyID } from '../lib/api/Chat/GetChatbyID';
import { formatTimestamp } from '../utils/FormatTimestamp';
import { defaultPFPS } from '../lib/Data';
import fetchUserData from '../lib/api/UserData';
import { Link } from 'react-router-dom';
import { PostComponentProps } from '../components/PostComponent';
import ReactMarkdown from 'react-markdown';
import { DiscEmojiSupport, MeowerEmojiSupport, getReactions } from '../lib/RevisePost';
import { reactToAPost } from '../lib/api/Post/ReactToPost';

export default function Groupchats() {
  const { userToken } = usePostContext();
  const [groupchats, setGroupchats] = useState<gcParameters[]>([]);
  const [, setAllGroupchats] = useState<gcParameters[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [itemsToLoadMore, setItemsToLoadMore] = useState(10);

  useEffect(() => {
    const fetchGroupChats = async () => {
      try {
        const storedData = localStorage.getItem("userData");
        const parsedData = storedData ? JSON.parse(storedData) : {};
        const chats = parsedData.chats || [];

        const chatPromises = chats.map((gc: { _id: string; }) =>
          getChatbyID(userToken, gc._id).then(chatData => ({ ...gc, posts: chatData }))
        );

        const updatedChats = await Promise.all(chatPromises);
        setAllGroupchats(updatedChats);
        updateGroupChats(updatedChats, parsedData);
      } catch (error) {
        console.error("Failed to fetch group chats:", error);
      }
    };

    fetchGroupChats();
  }, [userToken]);

  const updateGroupChats = (updatedChats: gcParameters[], parsedData: any) => {
    const oneWeekAgo = Date.now() / 1000 - (7 * 24 * 60 * 60);

    const filteredChats = updatedChats.filter(gc => {
      const matchesCategory = (() => {
        switch (activeCategory) {
          case "Starred":
            return parsedData.account?.favorited_chats.includes(gc._id);
          case "Owned":
            return gc.owner === parsedData.account._id;
          case "Other Chats":
            return gc.owner !== parsedData.account._id && gc.type !== 1;
          case "DMS":
            return gc.type !== 0;
          case "Recent Activity":
            return gc.last_active > oneWeekAgo;
          case "All":
          default:
            return true;
        }
      })();

      const matchesSearch = gc.nickname?.toLowerCase().includes(searchQuery.toLowerCase()) ?? true;

      return matchesCategory && matchesSearch;
    }).slice(0, itemsToLoadMore);

    setGroupchats(filteredChats);
  };

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight) {
      setItemsToLoadMore(prevItems => prevItems + 10);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const categories = ["All", "Recent Activity", "Starred", "Owned", "Other Chats", "DMS"];

  return (
    <div>
      <div className={styles.categoryButtons}>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={activeCategory === category ? styles.activeButton : ""}
          >
            {category}
          </button>
        ))}
        <input
          type="text"
          placeholder="Search"
          className="search-category-container"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {groupchats.map(gc => (
        <Groupchat
          key={gc._id}
          {...gc}
        />
      ))}
    </div>
  );
}

export type gcParameters = {
  _id: string;
  created: number;
  deleted: boolean;
  emojis: string[];
  icon: string;
  last_active: number;
  members: string[];
  nickname: string;
  owner: string;
  stickers: string[];
  type: number;
  icon_color: string;
  posts: PostComponentProps[];
};

const Groupchat: React.FC<gcParameters> = (props) => {
  const { _id, created, icon, last_active, members, nickname, owner, posts, icon_color, type } = props;
  const storedData = localStorage.getItem("userData");
  const parsedData = storedData ? JSON.parse(storedData) : {};
  const otherUser = type === 1 ? members.find(member => member !== parsedData.account._id) : null;

  const [pfp, setPfp] = useState("");
  const [avatarColor, setAvatarColor] = useState("#007BFF");

  useEffect(() => {
    if (type === 1 && otherUser) {
      fetchUserData(otherUser).then(data => {
        const pfpUrl = data?.avatar
          ? `https://uploads.meower.org/icons/${data.avatar}`
          : (data?.pfp_data !== undefined ? defaultPFPS[data.pfp_data] : defaultPFPS[22]);

        const color = `#${data?.avatar_color || "007BFF"}`;
        setPfp(pfpUrl);
        setAvatarColor(color);
      }).catch(error => {
        console.error("Error fetching user data:", error);
      });
    }
  }, [otherUser, type]);

  const hasPosts = posts.length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img
          src={type === 1 ? pfp : icon ? `https://uploads.meower.org/icons/${icon}` : defaultPFPS[22]}
          alt="Group Avatar"
          width={24}
          height={24}
          style={{ border: `2px solid ${avatarColor}`, objectFit: 'cover' }}
          className={styles.userAvatar}
        />
        <h2 className={styles.userheading} style={{ color: avatarColor || icon_color }}>
          {type === 1 && otherUser ? <Link to={`/users/${otherUser}`}>{otherUser}</Link> : nickname}
          <i>{_id}</i>
        </h2>
        <div style={{ marginLeft: 'auto', fontSize: '14px' }}>
          <button><Link to={otherUser ? `/users/${otherUser}/dm` : `/chats/${_id}`}>Enter</Link></button>
          <button>{parsedData.account.favorited_chats.includes(_id) ? '★' : '☆'}</button>
        </div>
      </div>

      <div className={styles.infobox}>
        {[{ label: 'Created', value: formatTimestamp(created) }, { label: 'Last Active', value: formatTimestamp(last_active) }].map(({ label, value }, index) => (
          <div key={index}>
            <strong>{label}:</strong>
            <span> {value}</span>
          </div>
        ))}
        {type !== 1 && (
          <>
            <div>
              <strong>Owner:</strong>
              <span> {owner}</span>
            </div>
            <details>
              <summary>
                <strong>{members.length} Members:</strong>
              </summary>
              <span>{members.join(', ')}</span>
            </details>
          </>
        )}
      </div>

      {hasPosts && (
        <div className={styles.recentactivity}>
          {posts.slice(0, 2).map(({ u: user, p: message, author }) => {
            const avatar = author.avatar === ""
              ? author.pfp_data === -3
                ? "/furrchat/assets/default_pfps/icon_guest-e8db7c16.svg"
                : defaultPFPS[author.pfp_data] || defaultPFPS[22]
              : `https://uploads.meower.org/icons/${author.avatar}`;

            return (
              <div key={user} className={styles.activityitem}>
                <Link to={`/users/${user}`}>
                  <img className={styles.useravatar} src={avatar} alt="User Avatar" width={24} height={24} style={{ objectFit: 'cover' }} />
                </Link>
                <span>
                  <b>{`${user}: `}</b>
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => {
                        if (children && typeof children === 'string') {
                          const text = children;
                          return <>{text.length > 100 ? `${text.substring(0, 100)}...` : text}</>;
                        }
                        return <>{children}</>;
                      },
                    }}
                  >
                    {DiscEmojiSupport(MeowerEmojiSupport(message.trim()))}
                  </ReactMarkdown>
                  {message.reactions && getReactions(message.reactions, message.post_id, reactToAPost)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
