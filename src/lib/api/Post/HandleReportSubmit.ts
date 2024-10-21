export const handleReportSubmit = async (userToken: string, post: string | null, selectedOption: string, comment: string) => {    
    if (!userToken) {
      throw new Error("User token is missing");
    }
    const postId = post;
    const reason = selectedOption;
  
    try {
      const response = await fetch(`https://api.meower.org/posts/${postId}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Token: userToken,
        },
        body: JSON.stringify({
          reason: reason,
          comment: comment,
        }),
      });
  
      if (!response.ok) {
        const errorMessage = await response.text(); // Capture the response text
        const message = `Error reporting post: ${response.status} ${response.statusText} - ${errorMessage}`;
        throw new Error(message); // Re-throw for external handling
      }
  
      console.log("Post reported successfully");
  
    } catch (error) {
      console.error("Error reporting post:", error);
      throw error; // Re-throw for external handling
    }
  };  