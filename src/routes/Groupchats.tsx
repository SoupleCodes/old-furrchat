import React, { useState, useEffect } from 'react';
import { usePostContext } from "../Context";
import styles from '../styles/Groupchats.module.css';
import { getChatbyID } from '../lib/api/Chat/GetChatbyID';
import { PostComponentProps } from '../components/PostComponent';
import { formatTimestamp } from '../utils/FormatTimestamp';
import { defaultPFPS } from '../lib/Data';
import fetchUserData from '../lib/api/UserData';

export default function Groupchats() {
  const { userToken } = usePostContext();
  const [groupchats, setGroupchats] = useState<gcParameters[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    async function fetchGroupChats() {
      try {
        const storedData = localStorage.getItem("userData");
        const parsedData = storedData ? JSON.parse(storedData) : {};
        const chats = parsedData.chats;

        const chatPromises = chats
          .map(async (gc: any) => {
            const chatData = await getChatbyID(userToken, gc._id);
            return { ...gc, posts: chatData };
          });

        const updatedChats = await Promise.all(chatPromises);
        setGroupchats(updatedChats);
      } catch (error) {
        console.error("Failed to fetch group chats:", error);
      }
    }

    fetchGroupChats();
  }, [userToken]);

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
      {groupchats
        .filter((gc) => {
          if (activeCategory === "All") {
            return true;
          } else if (activeCategory === "Starred") {
            const storedData = localStorage.getItem("userData");
            const parsedData = storedData ? JSON.parse(storedData) : {};
            const favoritedChats = parsedData.account?.favorited_chats || [];
            return favoritedChats.includes(gc._id);

          } else if (activeCategory === "Owned") {
            const storedData = localStorage.getItem("userData");
            const parsedData = storedData ? JSON.parse(storedData) : {};
            return gc.owner === parsedData.account._id;

          } else if (activeCategory === "Other Chats") {
            const storedData = localStorage.getItem("userData");
            const parsedData = storedData ? JSON.parse(storedData) : {};
            return gc.owner !== parsedData.account._id && gc.type !== 1;

          } else if (activeCategory === "DMS") {
            return gc.type !== 0;

          } else if (activeCategory === "Recent Activity") {
            const oneWeekAgo = Date.now() / 1000 - (7 * 24 * 60 * 60);
            console.log(gc.last_active > oneWeekAgo);
            return gc.last_active > oneWeekAgo;
          }
          return false;
        })
        .filter((gc) => {
          if (gc.type === 0) {
            return gc.nickname ? gc.nickname.toLowerCase().includes(searchQuery.toLowerCase()) : true;
          } else if (gc.type === 1) {
            const storedData = localStorage.getItem("userData");
            const parsedData = storedData ? JSON.parse(storedData) : {};
            const otherUser = gc.type === 1 ? gc.members.find(member => member !== parsedData.account._id) : null;
            return otherUser ? otherUser.toLowerCase().includes(searchQuery.toLowerCase()) : true;
          }
          return false;
        })

        .map((gc) => (
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
    if (type === 1) {
      fetchUserData(otherUser ?? "").then(data => {
        const pfpUrl = `${data?.avatar === ""
          ? data?.pfp_data === -3
            ? "/furrchat/assets/default_pfps/icon_guest-e8db7c16.svg"
            : `${defaultPFPS[data?.pfp_data] || defaultPFPS[22]}`
          : `https://uploads.meower.org/icons/${data?.avatar}`
          }`;
        const color = `#${data?.avatar_color || "#007BFF"}`;

        setPfp(pfpUrl);
        setAvatarColor(color);
      }).catch(error => {
        console.error("Error fetching user data:", error);
      });
    }
  }, []);

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
            border: `2px solid ${avatarColor}`
          }}
        />
        <h2 style={{ color: avatarColor || icon_color }}>
          {type === 1 && otherUser ? otherUser : nickname}
          <i>{_id}</i>
        </h2>

        <div style={{ marginLeft: 'auto' }}>
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
                <img src={avatar} alt="User Avatar" width={28} height={28} />
                <span><b>{`${user}: `}</b> {message.trim().length > 100 ? message.trim().substring(0, 100) + "..." : message.trim()}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};