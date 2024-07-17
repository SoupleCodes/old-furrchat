// Import the client from a remote URL
// @ts-ignore
import { client } from "https://esm.sh/jsr/@meower/api-client@1.0.0-rc.4"

// Function to handle form submission for login
export const handleSubmit = (username: string, password: string, setLoginSuccess: (success: boolean) => void, setLoginError: (error: boolean) => void) => {
    return (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission behavior

        // Send a POST request to authenticate the user
        fetch("https://api.meower.org/auth/login", {
            method: "POST",
            body: JSON.stringify({ username, password }), // Send username and password in request body
            headers: { "Content-Type": "application/json" }, // Set content type to JSON
        })
        .then(response => response.json()) // Parse the JSON response
        .then(json => {
            if (json.token) {
                localStorage.setItem('userToken', json.token)
                setLoginSuccess(true);
                setLoginError(false);
            } else {
                setLoginSuccess(false);
                setLoginError(true); // Set error state if login fails
            }
        });
    };
};
