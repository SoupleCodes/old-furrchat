export const updateConfigAndLocalStorage = async (param: string | number, newValue: any, userToken: any, setUserData: (arg0: (prev: any) => any) => void) => {
    try {
      // Update configuration
      const response = await fetch("https://api.meower.org/me/config", {
        method: "PATCH",
        body: JSON.stringify({ [param]: newValue }),
        headers: {
          "Content-Type": "application/json",
          Token: userToken,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        
        // Update local storage
        const storedData = JSON.parse(localStorage.getItem("userData") || "{}");
        localStorage.setItem("userData", JSON.stringify({
          ...storedData,
          account: { ...storedData.account, [param]: newValue }
        }));
  
        // Update user data in context
        setUserData((prev: { account: any; }) => ({
          ...prev,
          account: { ...prev.account, [param]: data[param] }
        }));
      } else {
        console.error("Failed to update configuration");
      }
    } catch (error) {
      console.error("Error updating configuration:", error);
    }
  };  