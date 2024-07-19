type User = {
  _id: string;
  avatar: string;
  avatar_color: string;
  banned: boolean;
  created: number;
  error: boolean;
  flags: number;
  last_seen: number;
  lower_username: string;
  lvl: number;
  permissions: number;
  pfp_data: number;
  quote: string;
  uuid: string;
};

// Cache for user data
const userDataCache = new Map();

// Optimized fetchUserData with caching
function fetchUserData(user: string, find: keyof User) {
  if (userDataCache.has(user)) {
    const cachedUser = userDataCache.get(user);
    return cachedUser[find];
  } else {
    return fetch(`https://api.meower.org/users/${user}`)
      .then((response) => response.json())
      .then((data: User) => {
        userDataCache.set(user, data);
        return data[find];
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        return null;
      });
  }
}

export default fetchUserData;
