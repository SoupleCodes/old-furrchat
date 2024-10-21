import { useParams } from 'react-router-dom';
import fetchUserData from '../lib/api/UserData';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import PostComponent from '../components/PostComponent';
import { getPostsFromUser } from '../lib/api/Post/GetPostsFromUser.ts';
import { usePostContext } from '../Context';
import { DiscEmojiSupport } from "../lib/RevisePost";
import { ImageRenderer } from '../utils/ImageRenderer.tsx';
import { defaultPFPS } from '../lib/Data.ts';
import { Link } from 'react-router-dom';

export default function UserPage() {
    const { username } = useParams();
    const [userData, setUserData] = useState<any>(null);
    const { userToken } = usePostContext();
    const [userPosts, setUserPosts] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const posts = await getPostsFromUser({ user: username ?? "", userToken, userParam: "posts" });
                setUserPosts(posts.autoget);

                const userData = await fetchUserData(username ?? "");
                setUserData(userData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (username) {
            fetchData();
        }
    }, [username, userToken]);

    if (!userData) {
        return <div>Loading...</div>;
    }

    const {
        _id, avatar, avatar_color, banned,
        created, last_seen, pfp_data,
        quote
    } = userData;

    const pronounsMatch = quote.match(/\s*\[([^\]]+)\]\s*$/);

    let displayedQuote = quote;
    let pronouns;

    if (pronounsMatch && quote.endsWith(pronounsMatch[0])) {
        displayedQuote = quote.replace(pronounsMatch[0], '');
        pronouns = pronounsMatch[1].trim();
    }

    displayedQuote = DiscEmojiSupport(displayedQuote);

    const avatarUrl = avatar === ""
        ? pfp_data === -3
            ? "/furrchat/assets/default_pfps/icon_guest-e8db7c16.svg"
            : `${defaultPFPS[pfp_data]}`
        : `https://uploads.meower.org/icons/${avatar}`;

    return (
        <div className="settings-container">
            <div className="settings">
            <div className="user-profile">
                <div className="profile-info">
                    <div className="post-pfp-container">
                        <img
                            src={avatarUrl}
                            alt={`${_id}'s profile picture`}
                            className="post-pfp"
                            width="128"
                            height="128"
                            style={{
                                borderRadius: "25%",
                                border: "2.5px solid",
                                borderColor: `#${avatar_color}`,
                                boxShadow: "0px 0px 6px rgba(0, 0, 0, 0.4)",
                            }}
                        />
                    </div>
                    <div className="user-text">
                        {_id}
                        {pronouns &&
                            <p className="pronouns">
                                ({pronouns})
                            </p>}
                    </div>
                </div>
                <div className="user-bio-container">
                    {displayedQuote &&
                    <div className="user-bio">
                        <ReactMarkdown
                            components={{
                                //@ts-ignore
                                img: ImageRenderer
                            }}
                        >{displayedQuote}</ReactMarkdown>
                    </div>
                    }
                    <div className="user-bio">
                        <p>Created: {new Date(created * 1000).toLocaleString()}</p>
                    </div>
                    <div className="user-bio">
                        <p>Last Seen: {new Date(last_seen * 1000).toLocaleString()}</p>
                        {banned && <p className="banned">Banned</p>}
                    </div>
                </div>
            </div>
            <div className="settings-buttons" style={{ float: 'right' }}>
                    <Link to={`/users/${_id}/dm`}>
                        <button className="button">Message</button>
                    </Link>
                </div>
            </div>
            <hr style={{ borderTop: '1px solid #0000001f', width: '100%' }} />
            <strong>User's Latest Posts:</strong>
            <div className="user-posts">
                {userPosts.slice(0, 12).map(post => (
                    <PostComponent
                        key={post._id}
                        post={post.p}
                        u={post.u}
                        p={post.p}
                        attachments={post.attachments}
                        author={post.author}
                        isDeleted={post.isDeleted}
                        pinned={post.pinned}
                        post_id={post.post_id}
                        post_origin={post.post_origin}
                        reactions={post.reactions}
                        reply_to={post.reply_to}
                        time={post.t}
                        type={post.type}
                        user={post.u}
                        active={false}
                        edited={post.edited_at !== undefined}
                    />
                ))}
            </div>
        </div>
    );
}