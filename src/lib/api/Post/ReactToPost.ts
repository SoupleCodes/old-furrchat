import { useCallback } from 'react';
import { usePostContext } from "../../../Context";

export const reactToAPost = () => {
  const { userData, userToken } = usePostContext();

  const reactToPost = useCallback(async (post_id: string | null, emoji: string) => {
    const currentUser = userData?.username;

    const emojiRegex = /\\?<:([a-z0-9]+)>/gi;
    let reactionEmoji = emoji;

    if (emojiRegex.test(emoji)) {
      reactionEmoji = reactionEmoji.substring(2, reactionEmoji.length - 1);
    }

    try {
      const deleteResponse = await fetch(`https://api.meower.org/posts/${post_id}/reactions/${reactionEmoji}/${currentUser}`, {
        method: "DELETE",
        headers: {
          Token: userToken,
        },
      });

      if (deleteResponse.ok) {
        console.log("Reaction removed successfully");
      } else {
        const addResponse = await fetch(`https://api.meower.org/posts/${post_id}/reactions/${reactionEmoji}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Token: userToken,
          },
        });

        if (addResponse.ok) {
          console.log("Reaction added successfully");
        } else {
          console.error("Failed to add reaction");
        }
      }
    } catch (error) {
      console.error(`Error reacting to post: ${error}`);
    }
  }, [userData, userToken]); 

  return reactToPost;
};