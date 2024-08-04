document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token'); // Store and retrieve the token securely
  const ws = new WebSocket(`wss://${window.location.hostname}:5555`);

  const nickname = localStorage.getItem('nickname');
  const chatroom = localStorage.getItem('chatroom');

  ws.onopen = () => {
    ws.send(JSON.stringify({
      tag: 'login',
      nickname: nickname,
      roomNumber: chatroom,
      publicKey: 'UserPublicKeyHere' // Replace with actual public key
    }));
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switch (data.tag) {
      case 'presence':
        const onlineUsersList = document.getElementById('online-users-list');
        onlineUsersList.innerHTML = '';
        data.presence.forEach(user => {
          const li = document.createElement('li');
          li.textContent = user.nickname;
          onlineUsersList.appendChild(li);
        });
        break;
      case 'chat message':
        const chatBox = document.getElementById('chat-box');
        const li = document.createElement('li');
        li.textContent = `${data.name} [${data.date}]: ${data.message}`;
        chatBox.appendChild(li);
        break;
      case 'typing':
        const feedback = document.getElementById('feedback');
        feedback.innerHTML = `<p>${data.message}</p>`;
        setTimeout(() => {
          feedback.innerHTML = '';
        }, 2000);
        break;
      case 'check':
        ws.send(JSON.stringify({ tag: 'check' }));
        break;
      // Add other cases for different tags if needed
    }
  };

  const chatForm = document.getElementById('chatForm');
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const messageInput = document.getElementById('messageInput');
    ws.send(JSON.stringify({
      tag: 'chat message',
      roomNumber: chatroom,
      name: nickname,
      message: messageInput.value
    }));
    messageInput.value = '';
  });

  const pvChatForm = document.getElementById('pvChatForm');
  pvChatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const pvMessageInput = document.getElementById('pvMessageInput');
    ws.send(JSON.stringify({
      tag: 'pvChat',
      to: 'RecipientSocketIdHere', // Replace with actual recipient ID
      from: ws._socket.remoteAddress,
      message: pvMessageInput.value
    }));
    pvMessageInput.value = '';
  });

  const messageInput = document.getElementById('messageInput');
  messageInput.addEventListener('input', () => {
    ws.send(JSON.stringify({
      tag: 'typing',
      roomNumber: chatroom,
      name: nickname
    }));
  });
});
