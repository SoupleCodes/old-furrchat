import { useState, useEffect } from "react";
import { usePostContext } from "../Context.tsx";
import { getInbox } from "../lib/api/UserMessages.ts";
import PostComponent from "../components/PostComponent.tsx";
import '../styles/Messages.css'

interface InboxData {
  autoget: any[];
  error: boolean;
  "page#": number;
  pages: number;
}

export default function Messages() {
  const { userToken } = usePostContext();
  const [inbox, setInbox] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchInbox = async () => {
      if (userToken) {
        try {
          const data: InboxData = await getInbox(userToken, currentPage);
          setInbox(Array.isArray(data.autoget) ? data.autoget : []);
          setTotalPages(data.pages || 1);
        } catch (error) {
          console.error("Failed to fetch inbox:", error);
        }
      }
    };

    fetchInbox();
  }, [userToken, currentPage]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber); window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="posts">
      {Array.isArray(inbox) && inbox.length > 0 ? (
        inbox.map((post) => (
          <PostComponent
            key={post._id || post.post_id}
            _id={post._id || ""}
            attachments={post.attachments || []}
            isDeleted={post.isDeleted || false}
            post={post.p || ""}
            pinned={post.pinned || false}
            post_id={post.post_id || null}
            post_origin={post.post_origin || null}
            time={{
              e: post.edited_at !== undefined ? post.edited_at : post.t?.e || 0,
            }}
            type={post.type || 0}
            user={post.u || "unknown"}
            active={false}
            edited={post.edited_at !== undefined}
            author={post.author}
            reactions={post.reactions}
            reply_to={post.reply_to} u={undefined} p={undefined}          />
        ))
      ) : (
        <p>No messages available</p>
      )}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button key={index + 1} onClick={() => paginate(index + 1) }>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}