export async function getPostsFromUser({ user, userToken }: { user: string; userToken: string; }) {

    const response = await fetch(`https://api.meower.org/users/${user}/posts`, {
      method: "GET",
      headers: {
        'Authorization': userToken,
      },
    });
  
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
  
    const data = await response.json();
    console.log('Data:', data);
    return data.autoget;
}