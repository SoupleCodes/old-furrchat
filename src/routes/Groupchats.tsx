import React, { useState, useEffect } from 'react';
import { usePostContext } from "../Context";
import styles from '../styles/Groupchats.module.css';
import { getChatbyID } from '../lib/api/Chat/GetChatbyID';
import { PostComponentProps } from '../components/PostComponent';
import { formatTimestamp } from '../utils/FormatTimestamp';
import { defaultPFPS } from '../lib/Data';

export default function Groupchats() {
  const { userToken } = usePostContext();
  const [groupchats, setGroupchats] = useState<gcParameters[]>([]);

  useEffect(() => {
    async function fetchGroupChats() {
      try {
        const storedData = localStorage.getItem("userData");
        const parsedData = storedData ? JSON.parse(storedData) : {};
        const chats = parsedData.chats;

        const chatPromises = chats
          .filter((gc: any) => gc.type === 0)
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

  return (
    <div className="groupchats">
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
  icon_color
}) => {

  const storedData = localStorage.getItem("userData");
  const parsedData = storedData ? JSON.parse(storedData) : {};

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img src={icon ? `https://uploads.meower.org/icons/${icon}` : '/furrchat/assets/icons/Favicon.svg'} alt="Group Avatar" width={48} height={48} />
        <h2 style={{ color: `#${icon_color}`}}>
          {nickname}
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
          { label: 'Owner', value: owner },
        ].map(({ label, value }, index) => (
          <div key={index}>
            <strong>{label}:</strong>
            <span> {value}</span>
          </div>
        ))}
           <details>
            <summary>
              <strong>{members.length} Members:</strong>
            </summary>
            <span>
            {members.join(', ')}
            </span>
          </details>
      </div>

      <div className={styles.recentactivity}>
        {[
          {
            user: posts[0].u,
            message: posts[0].p,
            avatar: `${posts[0].author.avatar === ""
              ? posts[0].author.pfp_data === -3
                ? "/furrchat/assets/default_pfps/icon_guest-e8db7c16.svg"
                : `${defaultPFPS[posts[0].author.pfp_data] || defaultPFPS[22]}`
              : `https://uploads.meower.org/icons/${posts[0].author.avatar}`
              }`
          },

          {
            user: posts[1].u,
            message: posts[1].p,
            avatar: `${posts[1].author.avatar === ""
              ? posts[1].author.pfp_data === -3
                ? "/furrchat/assets/default_pfps/icon_guest-e8db7c16.svg"
                : `${defaultPFPS[posts[1].author.pfp_data] || defaultPFPS[22]}`
              : `https://uploads.meower.org/icons/${posts[1].author.avatar}`
              }`
          }

        ].map(({ user, message, avatar }) => (
          <div key={user} className={styles.activityitem}>
            <img src={avatar} alt="User Avatar" width={28} height={28} />
            <span><b>{`${user}: `}</b> {message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};