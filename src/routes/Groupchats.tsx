import React, { useState, useEffect } from 'react';
import { usePostContext } from "../Context";
import styles from '../styles/Groupchats.module.css';
import { getChatbyID } from '../lib/api/Chat/GetChatbyID';
import { PostComponentProps } from '../components/PostComponent';
import { formatTimestamp } from '../utils/FormatTimestamp';
import { defaultPFPS } from '../lib/Data';
import fetchUserData from '../lib/api/UserData';
import { Link } from 'react-router-dom';

export default function Groupchats() {
  const { userToken } = usePostContext();
  const [groupchats, setGroupchats] = useState<gcParameters[]>([]);
  const [, setAllGroupchats] = useState<gcParameters[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [itemsToLoadMore, setItemsToLoadMore] = useState(10);

  useEffect(() => {
    async function fetchGroupChats() {
      try {
        const storedData = localStorage.getItem("userData");
        const parsedData = storedData ? JSON.parse(storedData) : {};
        const chats = parsedData.chats;

        const chatPromises = chats.map(async (gc: any) => {
          const chatData = await getChatbyID(userToken, gc._id);
          return { ...gc, posts: chatData };
        });

        const updatedChats = await Promise.all(chatPromises);
        setAllGroupchats(updatedChats);

        const filterChats = (gc: gcParameters) => {
          if (activeCategory === "All") return true;
          if (activeCategory === "Starred") {
            return parsedData.account?.favorited_chats.includes(gc._id);
          }
          if (activeCategory === "Owned") {
            return gc.owner === parsedData.account._id;
          }
          if (activeCategory === "Other Chats") {
            return gc.owner !== parsedData.account._id && gc.type !== 1;
          }
          if (activeCategory === "DMS") {
            return gc.type !== 0;
          }
          if (activeCategory === "Recent Activity") {
            const oneWeekAgo = Date.now() / 1000 - (7 * 24 * 60 * 60);
            return gc.last_active > oneWeekAgo;
          }
          return false;
        };

        const searchChats = (gc: gcParameters) => {
          if (gc.type === 0) {
            return gc.nickname?.toLowerCase().includes(searchQuery.toLowerCase()) ?? true;
          } else if (gc.type === 1) {
            const otherUser = gc.members.find(member => member !== parsedData.account._id);
            return otherUser?.toLowerCase().includes(searchQuery.toLowerCase()) ?? true;
          }
          return false;
        };

        const filteredChats = updatedChats
          .filter(filterChats)
          .filter(searchChats);

        setGroupchats(filteredChats.slice(0, itemsToLoadMore));

      } catch (error) {
        console.error("Failed to fetch group chats:", error);
      }
    }

    fetchGroupChats();
  }, [userToken, itemsToLoadMore, activeCategory, searchQuery]);

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight) {
      setItemsToLoadMore(prevItems => prevItems + 10);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const categories = ["All", "Recent Activity", "Starred", "Owned", "Other Chats", "DMS"];

  return (
    <div>
      <div className={styles.categoryButtons}>
        {categories.map((category) => (
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
      {groupchats.map((gc) => (
        <Groupchat
          key={gc._id}
          _id={gc._id}
          created={gc.created}
          deleted={gc.deleted}
          emojis={gc.emojis}
          icon={gc.icon}
          last_active={gc.last_active}
          members={gc.members}
          nickname={gc.nickname}
          owner={gc.owner}
          stickers={gc.stickers}
          type={gc.type}
          posts={gc.posts}
          icon_color={gc.icon_color}
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

const Groupchat: React.FC<gcParameters> = ({
  _id,
  created,
  icon,
  last_active,
  members,
  nickname,
  owner,
  posts,
  icon_color,
  type
}) => {

  const storedData = localStorage.getItem("userData");
  const parsedData = storedData ? JSON.parse(storedData) : {};
  const otherUser = type === 1 ? members.find(member => member !== parsedData.account._id) : null;

  const [pfp, setPfp] = useState("");
  const [avatarColor, setAvatarColor] = useState("#007BFF"); // default color

  useEffect(() => {
    if (type === 1 && otherUser) {
      fetchUserData(otherUser).then(data => {
        const pfpUrl = `${data?.avatar === ""
          ? data?.pfp_data === -3
            ? "/furrchat/assets/default_pfps/icon_guest-e8db7c16.svg"
            : `${defaultPFPS[data?.pfp_data] || defaultPFPS[22]}`
          : `https://uploads.meower.org/icons/${data?.avatar}`
          }`;
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
        <img src={
          type === 1 ? pfp :
            icon ? `https://uploads.meower.org/icons/${icon}` : defaultPFPS[22]
        }
          alt="Group Avatar"
          width={48}
          height={48}
          style={{
            border: `2px solid ${avatarColor}`,
            objectFit: 'cover'
          }}
        />
        <h2 className={styles.userheading} style={{ color: avatarColor || icon_color }}>
          {type === 1 && otherUser ? <Link to={`/users/${otherUser}`}>{otherUser}</Link> : nickname}
          <i>{_id}</i>
        </h2>

        <div style={{ marginLeft: 'auto' }}>
        <button><Link to={`/chats/${_id}`}>Enter</Link></button>
          {parsedData.account.favorited_chats.includes(_id) ? (
            <button>★</button>
          ) : (
            <button>☆</button>
          )}
        </div>
      </div>

      <div className={styles.infobox}>
        {[
          { label: 'Created', value: formatTimestamp(created) },
          { label: 'Last Active', value: formatTimestamp(last_active) },
        ].map(({ label, value }, index) => (
          <div key={index}>
           
            <strong>{label}:</strong>
            <span> {value}</span>
          </div>
        ))}
        {type !== 1 && (
          <>
            <div key="owner">
              <strong>Owner:</strong>
              <span> {owner}</span>
            </div>
            <details>
              <summary>
                <strong>{members.length} Members:</strong>
              </summary>
              <span>
                {members.join(', ')}
              </span>
            </details></>
        )}

      </div>

      {hasPosts && (
        <div className={styles.recentactivity}>
          {posts.slice(0, 2).map(({ u: user, p: message, author }) => {
            const avatar = author.avatar === ""
              ? author.pfp_data === -3
                ? "/furrchat/assets/default_pfps/icon_guest-e8db7c16.svg"
                : `${defaultPFPS[author.pfp_data] || defaultPFPS[22]}`
              : `https://uploads.meower.org/icons/${author.avatar}`;

            return (
              <div key={user} className={styles.activityitem}>
                <img src={avatar} alt="User Avatar" width={28} height={28} style={{ objectFit: 'cover' }}/>
                <span><b>{`${user}: `}</b> {message.trim().length > 100 ? message.trim().substring(0, 100) + "..." : message.trim()}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};