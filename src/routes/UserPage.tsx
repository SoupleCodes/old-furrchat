import { useParams } from 'react-router-dom';
import fetchUserData from '../lib/api/UserData';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import PostComponent from '../components/PostComponent';
import { getPostsFromUser } from '../lib/api/Post/GetPostsFromUser.ts';
import { usePostContext } from '../Context';

export default function UserPage() {
    const { username } = useParams();
    const [userData, setUserData] = useState<any>(null);
    const { userToken } = usePostContext();
    const [userPosts, setUserPosts] = useState<any[]>([]);
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const posts = await getPostsFromUser({user: username ?? "", userToken, userParam: "posts"});
                setUserPosts(posts);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        }
        
        fetchPosts();
    }, [username, userToken]);
    
    useEffect(() => {
        fetchUserData(username ?? "").then(data => {
            setUserData(
                data);
        }).catch(error => {
            console.error("Error fetching user data:", error);
        });
    }, [username]);

    if (!userData) {
        return <div>Loading...</div>;
    }

    const {
        _id, avatar, avatar_color, banned,
        created, last_seen,
        quote
    } = userData;

    const avatarUrl = avatar ? `https://uploads.meower.org/icons/${avatar}` :
        userData.pfp_data === -3 ?
            "/furrchat/assets/default_pfps/icon_guest-e8db7c16.svg" :
            `/furrchat/assets/default_pfps/icon${userData.pfp_data}.svg`;

    return (
        <div className="settings-container">
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
                                borderRadius: "5px",
                                border: "2.5px solid",
                                borderColor: `#${avatar_color}`,
                                boxShadow: "0px 0px 6px rgba(0, 0, 0, 0.4)"
                            }}
                        />
                    </div>
                    <div className="user-text">{_id}</div>
                </div>
                <div style={{ flexGrow: 1, flexDirection: "column" }}>
                    <div className="user-bio-container">
                    <div className="user-bio">
                        <ReactMarkdown>{quote}</ReactMarkdown>
                        </div>
                        <div className="user-bio">
                        <p>Created: {new Date(created * 1000).toLocaleString()}</p>
                        <p>Last Seen: {new Date(last_seen * 1000).toLocaleString()}</p>
                        {banned && <p className="banned">Banned</p>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="user-bio-container" style={{ margin: 'auto' }}>
            {userPosts.slice(0, 10).map(post => (
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
        _id={post._id} 
        user={post.u} 
        active={false} 
        edited={post.edited_at !== undefined} 
    />
))}
            </div>
        </div>
    );
}