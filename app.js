const fs = require('fs');
const https = require('https');
const express = require('express');
const WebSocket = require('ws');
const path = require('path');
const jwt = require('jsonwebtoken');
const sanitizeHtml = require('sanitize-html');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const app = express();

// Generate a strong secret key (or use a pre-generated one)
const secret = crypto.randomBytes(64).toString('hex');
console.log(`Your secret key is: ${secret}`);

// SSL certificates
const privateKey = fs.readFileSync(path.join(__dirname, 'certs', 'private-key.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, 'certs', 'certificate.pem'), 'utf8');
const credentials = { key: privateKey, cert: certificate };

const server = https.createServer(credentials, app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 5555;

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(express.json());

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server started on ${PORT}`);
});

let users = [];

const checkUserPresence = () => {
  users.forEach(user => {
    if (user.checks > 3) {
      user.isOnline = false;
      user.socket.close();
    } else {
      user.checks++;
      user.socket.send(JSON.stringify({ tag: 'check' }));
    }
  });
};

setInterval(checkUserPresence, 5000);

// Middleware to verify token
const verifyToken = (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return next(new Error('Authentication error'));
    }
    socket.username = decoded.username;
    next();
  });
};

wss.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress;
  console.log(`User connected from ${ip}`);

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    switch (data.tag) {
      case 'login':
        data.nickname = sanitizeHtml(data.nickname);
        users.push({
          id: ws._socket.remoteAddress,
          name: data.nickname,
          roomNumber: data.roomNumber,
          socket: ws,
          checks: 0,
          isOnline: true,
          publicKey: data.publicKey
        });
        ws.send(JSON.stringify({
          tag: 'presence',
          presence: users.map(user => ({
            nickname: user.name,
            jid: user.id,
            publickey: user.publicKey
          }))
        }));
        break;
      case 'chat message':
        data.message = sanitizeHtml(data.message);
        const date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        if (hours <= 9) hours = `0${hours}`;
        if (minutes <= 9) minutes = `0${minutes}`;
        data.date = `${hours}:${minutes}`;
        users.forEach(user => {
          if (user.roomNumber === data.roomNumber && user.isOnline) {
            user.socket.send(JSON.stringify(data));
          }
        });
        break;
      // Other cases
    }
  });

  ws.on('close', () => {
    console.log(`User disconnected from ${ip}`);
    const index = users.findIndex(user => user.socket === ws);
    if (index !== -1) {
      users.splice(index, 1);
      users.forEach(user => {
        if (user.isOnline) {
          user.socket.send(JSON.stringify({
            tag: 'presence',
            presence: users.map(u => ({
              nickname: u.name,
              jid: u.id,
              publickey: u.publicKey
            }))
          }));
        }
      });
    }
  });
});

// Example route to generate and return a token
app.post('/login', (req, res) => {
  const { username } = req.body; // You should validate the username/password in a real app
  const token = jwt.sign({ username }, secret, { expiresIn: '1h' });
  res.json({ token });
});
