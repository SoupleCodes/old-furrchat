// Import the client from a remote URL
// @ts-ignore
import { client } from "https://esm.sh/jsr/@meower/api-client@1.0.0-rc.4";

// Function to handle form submission for login
export const handleSubmit = (
  username: string,
  password: string,
  setLoginSuccess: (success: boolean) => void,
  setLoginError: (error: boolean) => void
) => {
  return (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Send a POST request to authenticate the user
    fetch("https://api.meower.org/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }), // Send username and password in request body
      headers: { "Content-Type": "application/json" }, // Set content type to JSON
    })
      .then((response) => response.json()) // Parse the JSON response
      .then((json) => {
        if (json.token) {
          setLoginSuccess(true);
          setLoginError(false);
          const userToken = json.token;

          // Establish WebSocket connection using the token
          const ws = new WebSocket(
            `wss://server.meower.org/?v=1&token=${userToken}`
          );

          ws.onmessage = (message) => {
            const data = JSON.parse(message.data);
            if (data.cmd === "auth") {
              const userData = data.val;
              const userToken = userData.token;
              console.log(userToken);
              localStorage.setItem("userToken", userToken);
            }
          };
        } else {
          setLoginSuccess(false);
          setLoginError(true); // Set error state if login fails
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
        setLoginSuccess(false);
        setLoginError(true); // Set error state if fetch or parsing fails
      });
  };
};
