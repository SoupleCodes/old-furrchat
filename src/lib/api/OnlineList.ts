const GetUlist = () => {
    const ws = new WebSocket('wss://server.meower.org');
    let onlineUsers: string[] = [];
  
    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
  
      // Handle online user list updates
      if (data.cmd === 'ulist') {
        onlineUsers = data.val.split(';').filter((user: string) => user !== ''); // Assuming users are separated by ';'
        console.log('Updated online users:', onlineUsers);
      }
    };
  
    const getIsOnline = () => onlineUsers;
  
    return { getIsOnline };
  };
  
  export default GetUlist;
  