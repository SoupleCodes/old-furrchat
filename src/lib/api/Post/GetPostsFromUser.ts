export async function getPostsFromUser({ user, userToken, userParam }: { user: string; userToken: string; userParam: string }) {

    const response = await fetch(`https://api.meower.org/users/${user}/${userParam}`, {
      method: "GET",
      headers: {
        'Token': userToken,
      },
    });
  
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
  
    const data = await response.json();
    console.log('Data:', data);
    return data;
}