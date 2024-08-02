export const handleSubmit = (
  username: string,
  password: string,
  _userToken: string,
  setUserToken: React.Dispatch<React.SetStateAction<string>>,
  setLoginSuccess: (success: boolean) => void,
  setLoginError: (error: boolean) => void
) => {
  return (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    fetch("https://api.meower.org/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }), // Send username and password in request body
      headers: { "Content-Type": "application/json" }, // Set content type to JSON
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.token) {
          setLoginSuccess(true);
          setLoginError(false);
          setUserToken(json.token);

          const ws = new WebSocket(`wss://server.meower.org/?v=1&token=${json.token}`);

          ws.onmessage = (message) => {
            const data = JSON.parse(message.data);
            if (data.cmd === "auth") {
              const userData = data.val;          
              setUserToken(userData.token);
              localStorage.setItem("userData", JSON.stringify(userData))
              window.location.reload()
            }
          }
        } else {
          setLoginSuccess(false)
          setLoginError(true)
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
        setLoginSuccess(false);
        setLoginError(true);
      });
  };
};