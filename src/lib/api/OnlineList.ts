import { useEffect, useState } from "react";

const useUserList = () => {
  const [userList, setUserList] = useState<string[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch("https://api.meower.org/ulist");
      if (!response.ok) {
        throw new Error("Failed to fetch user list");
      }
      const data = await response.json();
      const usernames = data.autoget.map((user: any) => user);
      setUserList(usernames);
    } catch (error) {
      console.error("Error fetching user list:", error);
      setUserList([]);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchData(); // Fetch data periodically
    }, 2500);

    // Cleanup function to clear interval on unmount or changes
    return () => clearInterval(intervalId);
  }, []);

  return userList;
};

export default useUserList;
