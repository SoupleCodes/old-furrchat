export const deletePost = async (postId: string | null, userToken: string) => {
  try {
    const response = await fetch(`https://api.meower.org/posts?id=${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Token: userToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete post with ID ${postId}`);
    }

    console.log(`Post with ID ${postId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting post:", error);
  }
};
