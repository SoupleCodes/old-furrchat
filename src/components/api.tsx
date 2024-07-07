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
  var foundUser = userData.find(u => u._id === user)
    if (foundUser) {
      return foundUser[find];
    } else {

      fetch(`https://api.meower.org/users/${user}`)
        .then((response) => response.json())
        .then((data: User) => {
          userData.push(data);
          var foundUser = userData.find(u => u._id === user)!
          return foundUser[find];
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          return null;
        });
        return null;
    }
  }
  

  export default fetchUserData;