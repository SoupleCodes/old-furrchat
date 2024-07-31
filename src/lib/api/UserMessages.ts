interface InboxData {
  autoget: any[];
  error: boolean;
  'page#': number; 
  pages: number;
}

export async function getInbox(userToken: string, page: number): Promise<InboxData> { 
  try {
    const response = await fetch(`https://api.meower.org/inbox/?page=${page}`, {
      method: "GET",
      headers: {
        Token: userToken,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch inbox: ${response.statusText}`);
    }

    const data = await response.json()
    console.log('Fetched data:', data)
    return data
  } catch (error) {
    console.error("Failed to fetch inbox:", error);
    throw error
  }
}