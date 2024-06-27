const ws = new WebSocket('wss://server.meower.org');

ws.onmessage = function(message) {
  console.log('Received message:', message.data);
  const data = JSON.parse(message.data);
  }

fetch("https://api.meower.org/home?autoget")
  .then(response => response.json())
  .then(posts => {
    console.log(posts);
  })
  .catch(error => {
    console.log("Error fetching posts:", error);
  });
