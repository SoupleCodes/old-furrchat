export async function getChatbyID(userToken: string, id: string): Promise<any[]> { 
    try {
      const response = await fetch(`https://api.meower.org/posts/${id}`, {
        method: "GET",
        headers: {
          Token: userToken,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch inbox: ${response.statusText}`);
      }
  
      const data = await response.json()
      return data.autoget
    } catch (error) {
      console.error("Failed to fetch chat:", error);
      throw error
    }
  }