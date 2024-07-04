type User = {
    "_id": string,
    "avatar": string,
    "avatar_color": string,
    "banned": boolean,
    "created": number,
    "error": boolean,
    "flags": number,
    "last_seen": number,
    "lower_username": string,
    "lvl": number,
    "permissions": number,
    "pfp_data": number,
    "quote": string,
    "uuid": string,
  }

const userData: User[] = [];

function fetchUserData(user: string, find: keyof User) {
    const foundUser = userData.find(u => u._id === user);
    if (foundUser) {
      // Return the user data from local database
      return foundUser[find];
    } else {
        
      // Fetch from API only if user data is not in local database
      fetch(`https://api.meower.org/users/${user}`)
        .then((response) => response.json())
        .then((data: User) => {
          userData.push(data);
          return (data as User)[find];
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          return null;
        });
        return;
    }
  }
  

  export default fetchUserData;