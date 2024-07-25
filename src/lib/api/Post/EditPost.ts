export const editPost = async (postId: string | null, userToken: string, editedPost: string) => {
    try {
      const response = await fetch(`https://api.meower.org/posts?id=${postId}`, {
        method: "PATCH",
        body: JSON.stringify({
          content: editedPost,
        }),
        headers: {
          "Content-Type": "application/json",
          Token: userToken,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to edit post with ID ${postId}`);
      }
  
      console.log(`Post with ID ${postId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  