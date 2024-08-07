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

// Cache for user data and pending requests
const userDataCache = new Map<string, User>();
const pendingRequests = new Map<string, Promise<User | null>>();

function fetchUserData(user: string): Promise<User | null> {
  if (userDataCache.has(user)) {
    return Promise.resolve(userDataCache.get(user) ?? null);
  } else if (pendingRequests.has(user)) {
    return pendingRequests.get(user)!; // Non-null assertion is safe here
  } else {
    const request = fetch(`https://api.meower.org/users/${user}`)
      .then(response => response.json())
      .then((data: User) => {
        userDataCache.set(user, data);
        pendingRequests.delete(user);
        return data;
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        pendingRequests.delete(user);
        return null;
      });

    pendingRequests.set(user, request);
    return request;
  }
}

export default fetchUserData;